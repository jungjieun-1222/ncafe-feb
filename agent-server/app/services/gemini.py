from google import genai
from google.genai import types
from app.config import GEMINI_API_KEY, GEMINI_MODEL
from typing import Generator, AsyncGenerator

client = genai.Client(api_key=GEMINI_API_KEY)
# Use MODEL_NAME from config
MODEL_NAME = GEMINI_MODEL
# MENU_DATA will be injected by menu_service
MENU_DATA = []

SAFETY_SETTINGS = [
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold=types.HarmBlockThreshold.BLOCK_NONE,
    ),
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold=types.HarmBlockThreshold.BLOCK_NONE,
    ),
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold=types.HarmBlockThreshold.BLOCK_NONE,
    ),
    types.SafetySetting(
        category=types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold=types.HarmBlockThreshold.BLOCK_NONE,
    ),
]

TOOLS = [
    types.Tool(
        function_declarations=[
            types.FunctionDeclaration(
                name="Maps_to",
                description="특정 페이지로 이동하거나 메뉴 상세 정보를 보여주는 신호를 보냄 (반드시 영문 슬러그 사용)",
                parameters=types.Schema(
                    type="OBJECT",
                    properties={
                        "path": types.Schema(type="STRING", description="이동할 페이지 경로 (예: /menus/americano, /cart, /orders 등)")
                    },
                    required=["path"]
                )
            ),
            types.FunctionDeclaration(
                name="add_to_cart",
                description="ID가 아닌 슬러그를 사용해 장바구니에 아이템을 추가함",
                parameters=types.Schema(
                    type="OBJECT",
                    properties={
                        "menu_slug": types.Schema(type="STRING", description="메뉴의 슬러그"),
                        "quantity": types.Schema(type="INTEGER", description="수량")
                    },
                    required=["menu_slug", "quantity"]
                )
            ),
            types.FunctionDeclaration(
                name="search_menu_by_slug",
                description="사용자의 질문을 분석해 관련 메뉴의 슬러그 정보를 찾아옴 (한글 이름으로 검색 가능)",
                parameters=types.Schema(
                    type="OBJECT",
                    properties={
                        "keyword": types.Schema(type="STRING", description="검색 키워드")
                    },
                    required=["keyword"]
                )
            ),
            types.FunctionDeclaration(
                name="create_inyeon_card",
                description="사용자의 인연 카드(관심사, 기분, 인사말)를 등록하거나 수정합니다.",
                parameters=types.Schema(
                    type="OBJECT",
                    properties={
                        "interests": types.Schema(type="ARRAY", items=types.Schema(type="STRING"), description="관심사 목록 (최대 5개, 예: 개발, 음악, 영화 등)"),
                        "mood": types.Schema(type="STRING", description="현재 기분 (예: 설렘, 여유, 심심, 영감, 위로)"),
                        "greeting": types.Schema(type="STRING", description="상대에게 건넬 짧은 인사말")
                    },
                    required=["interests", "mood", "greeting"]
                )
            ),
            types.FunctionDeclaration(
                name="find_match",
                description="현재 사용자와 가장 잘 어울리는 인연 후보를 한 명 찾아옵니다.",
                parameters=types.Schema(
                    type="OBJECT",
                    properties={}
                )
            ),
            types.FunctionDeclaration(
                name="respond_match",
                description="제안받은 인연에 대해 수락하거나 거절합니다.",
                parameters=types.Schema(
                    type="OBJECT",
                    properties={
                        "receiver_id": types.Schema(type="STRING", description="인연 후보의 사용자 ID"),
                        "action": types.Schema(type="STRING", description="수락(accept) 또는 거절(decline)")
                    },
                    required=["receiver_id", "action"]
                )
            )
        ]
    )
]

def get_system_instruction(context: str = ""):
    return """당신은 '엔카페(ncafe)'의 지혜로운 선비이자 친절한 카페주인장 '월하선생'입니다. 
    사용자의 질문에 대해 따뜻하고 정겨운 말투로 답변해 주시고, 필요할 때마다 적절한 페이지로 이동(Route)할 수 있는 도구를 사용해 주시오.

[말투 및 태도]
- 조선 시대 지식인의 고풍스러우면서도 **다정하고 정겨운** 말투를 사용하십시오. 
- (~하구려, ~하시겠소, ~오시구려, 허허 등) 정감 어린 표현을 적극 사용하십시오.

[의도 파악 및 내비게이션 규칙]
사용자의 발화 의도에 따라 아래의 경로(/path)를 `Maps_to` 도구에 실어 보내야 하오. **절대 경로에 한글 메뉴 이름을 넣지 말고 반드시 영문 슬러그를 사용하시오.**

1. **[메뉴 보기/상세]**: "~보여줘", "~얼마야?", "~있어?" 등 특정 메뉴에 관심을 보이면 해당 메뉴의 상세 페이지로 안내하시오.
   - 경로: `/menus/{slug}` (예: `/menus/americano`)
2. **[메뉴 목록]**: "메뉴판 보여줘", "뭐가 맛있어?", "차림표 보자" 등 전체 메뉴를 궁금해하면 메뉴 목록으로 안내하시오.
   - 경로: `/menus`
3. **[장바구니 확인]**: "장바구니 보여줘", "뭐 담았지?", "담은 거 확인해줘" 등은 장바구니로 안내하시오.
   - 경로: `/cart`
4. **[주문 확인]**: "내 주문", "주문 내역", "언제 나와?" 등은 주문 목록으로 안내하시오.
   - 경로: `/orders`
5. **[기타]**: 위치 확인(`/location`), 브랜드 이야기(`/story`), 예약(`/reservations`) 등

[맥락 추론 및 '이거' 처리]
- 사용자가 "이거 얼마야?", "이거 담아줘" 등 '이거' 혹은 '그거'라고 지칭할 때는 대화 맥락에서 **가장 최근에 언급된 메뉴**를 찾아 그 메뉴의 슬러그를 사용하시오.
- 메뉴의 정확한 슬러그를 모른다면 반드시 `search_menu_by_slug`를 먼저 호출하여 정보를 확인한 뒤 동작을 수행하시오.

[답변 규칙]
1. **[다정한 거절]**: 방문 시간이 마감(음료 20:30, 브런치 16:00) 이후라면 "가마 문을 닫을 시간이오"라며 따뜻하게 달래주시오.
2. **[메뉴 카드 출력]**: 메뉴를 추천하거나 언급할 때는 반드시 메뉴명 뒤에 '<<MENU:메뉴이름>>' 형식을 사용해 차림표를 띄우시오.
3. **[복합 동작]**: "아메리카노 보여주고 담아줘"와 같이 여러 요청을 하면 `Maps_to`와 `add_to_cart`를 **동시에 호출**하여 정성껏 처리하시오.
4. **[주문 및 담기 안내]**: 추천 뒤엔 "바로 주문하시겠소? 아니면 담아두시겠소?"라고 물어보아 사용자가 버튼을 누를 수 있게 하시오.
5. **[지식 근거]**: 제공된 지식을 바탕으로 선비의 지혜를 빌려 답하시오.
6. **[페르소나]**: 손님을 '선비님' 혹은 '아씨'이라 부르며 극진히 대접하시오."""

async def chat(messages: list, system_instruction: str = None) -> any:
    if system_instruction is None:
        system_instruction = get_system_instruction()
        
    response = await client.aio.models.generate_content(
        model=MODEL_NAME,
        contents=messages,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            max_output_tokens=2048,
            temperature=0.7,
            safety_settings=SAFETY_SETTINGS,
            tools=TOOLS
        )
    )
    
    # Safety check for candidates and content
    if not response.candidates or not response.candidates[0].content or not response.candidates[0].content.parts:
        return "죄송하오나, 그 말씀은 대답하기가 어렵구려. 다른 질문을 해주시겠소?"

    # Check for function calls
    for part in response.candidates[0].content.parts:
        if part.function_call:
            return response # Return the full response object so caller can handle tools
            
    return response.text

async def chat_stream(messages: list, system_instruction: str = None) -> AsyncGenerator[any, None]:
    if system_instruction is None:
        system_instruction = get_system_instruction()

    response = await client.aio.models.generate_content_stream(
        model=MODEL_NAME,
        contents=messages,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            max_output_tokens=2048,
            temperature=0.7,
            safety_settings=SAFETY_SETTINGS,
            tools=TOOLS
        )
    )
    async for chunk in response:
        if not chunk.candidates or not chunk.candidates[0].content or not chunk.candidates[0].content.parts:
            continue
            
        for part in chunk.candidates[0].content.parts:
            # 생각(thought) 과정은 건너뛰고 최종 사용자 전달 텍스트만 실시간 스트리밍
            if getattr(part, 'thought', False):
                continue
            if part.function_call:
                yield {"function_call": {
                    "name": part.function_call.name,
                    "args": part.function_call.args
                }}
            elif part.text:
                yield part.text

def search_menus(keyword: str):
    """Search for menu slugs by keyword in MENU_DATA."""
    results = []
    keyword = keyword.lower()
    for menu in MENU_DATA:
        if (keyword in menu.get("korName", "").lower() or 
            keyword in menu.get("engName", "").lower() or 
            keyword in menu.get("slug", "").lower()):
            results.append({
                "korName": menu.get("korName"),
                "slug": menu.get("slug")
            })
    return results
