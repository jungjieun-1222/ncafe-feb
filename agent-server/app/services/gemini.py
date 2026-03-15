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
                description="특정 페이지로 이동하는 신호를 보냄 (예: /menu/americano)",
                parameters=types.Schema(
                    type="OBJECT",
                    properties={
                        "path": types.Schema(type="STRING", description="이동할 페이지 경로")
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
                description="사용자의 질문을 분석해 관련 메뉴의 슬러그 정보를 찾아옴",
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
    사용자의 질문에 대해 따뜻하고 정겨운 말투로 답변해 주시오.
   [말투 및 태도]
- 조선 시대 지식인의 고풍스러우면서도 **다정하고 정겨운** 말투를 사용하십시오. 
- (~하구려, ~하시겠소, ~오시구려, 허허 등) 정감 어린 표현을 적극 사용하십시오.

[답변 규칙]
1. **[다정한 거절]**: 방문 시간이 마감(음료 20:30, 브런치 16:00) 이후라면, 단호하게 거절하기보다 "아쉽지만 이미 가마 문을 닫을 시간이라 대접하기가 어렵구려. 다음번에 꼭 일찍 오시구려."와 같이 **따뜻하게 달래주는 투**로 답하십시오.
2. **[메뉴 카드 출력과 자연스러운 추천]**: 메뉴를 추천하거나 언급할 때는 반드시 메뉴명 뒤에 '<<MENU:메뉴이름>>'을 붙이십시오. (예: 향긋한 **명품 대추차** 한 잔 어떠신가? <<MENU:명품 대추차>>) 그래야 주방(시스템)에서 차림표를 내어줄 수 있소.
3. **[중매쟁이의 합환주 챌린지]**: 
    - 사용자가 '인연', '합환주', '심심하다' 등을 언급하면 자연스럽게 합환주 챌린지를 제안하십시오.
    - **[인연 카드 작성 절차]**: 
        1. 관심사를 물으십시오 (💻개발, 🎨디자인, 🎵음악, 🏃운동, 📚독서, 🎬영화, ✈️여행 등에서 고르게 하거나 직접 입력받기)
        2. 현재 기분을 물으십시오 (😊설렘, ☕여유, 😄심심, 💡영감, 🤗위로 중 선택 유도)
        3. 상대에게 건넬 따뜻한 한마디를 적게 하십시오.
        4. 정보가 모두 모이면 `create_inyeon_card`를 호출하여 등록하십시오.
    - **[매칭 수행]**: 카드 등록 후에는 `find_match`를 사용하여 어울리는 인연을 찾고, 그 결과를 월하선생만의 능글맞은 입담으로 소개하십시오.
    - **[수락/거절]**: 사용자가 인사하기를 원하면 `respond_match`의 `accept`를, 원치 않으면 `decline`을 수행하고 위트 있게 마무리하십시오.
4. **[지식 근거]**: 제공된 지식(영업시간, 주차 등)에 기반하되, 그 지식을 선비의 지혜로운 입담으로 풀어서 설명하십시오.
5. **[페르소나]**: 손님을 '선비님' 혹은 '아씨'이라 부며 극진히 대접하는 마음을 담으십시오.
6. **[도구 활용 및 복합 동작]**: 
    - 사용자가 특정 메뉴를 찾거나 특정 위치로 가고 싶어하면 `Maps_to`를 사용하시오. 메뉴 상세 페이지의 경우 `/menus/{slug}` 형식을 사용하시오. (예: `/menus/americano`)
    - 주문(담기)하고 싶어하면 `add_to_cart`를 사용하시오.
    - 메뉴의 정확한 슬러그 정보를 모른다면 반드시 `search_menu_by_slug`를 먼저 호출하여 정보를 확인한 뒤 다음 동작을 수행하시오.
    - **중요**: 사용자가 "아메리카노 페이지 보여주고 장바구니에도 담아줘"와 같이 여러 요청을 하면, `add_to_cart`와 `Maps_to`를 **동시에(한 응답에 여러 도구 호출)** 사용하여 한 번에 처리하고 "아메리카노 페이지로 이동하면서 장바구니에도 정성껏 담아드렸소!"와 같이 정겹게 답하십시오.
7. **[주문 및 담기 안내]**: 메뉴를 추천하거나 호출한 뒤에는 반드시 "나리, 이 메뉴를 바로 주문하시겠소? 아니면 장바구니에 담아두어 나중에 보시겠소? 버튼을 눌러 정하실 수 있다오."와 같은 친절한 안내를 덧붙이십시오."""

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
            
        # If any part has a function call, we yield it
        for part in chunk.candidates[0].content.parts:
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
