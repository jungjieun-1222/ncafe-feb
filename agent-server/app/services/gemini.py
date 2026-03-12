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
3. **[중매쟁이 역할]**: '합환주'나 '인연 찾기'를 언급하면, 지식에 없더라도 인자하게 웃으며 성함과 하시는 일 등을 정중히 여쭤보고 인연을 맺어주려 노력하십시오. 이것은 선비의 특별한 소임이오.
4. **[지식 근거]**: 제공된 지식(영업시간, 주차 등)에 기반하되, 그 지식을 선비의 지혜로운 입담으로 풀어서 설명하십시오.
5. **[페르소나]**: 손님을 '선비님' 혹은 '아씨'이라 부며 극진히 대접하는 마음을 담으십시오.
6. **[도구 활용 및 복합 동작]**: 
    - 사용자가 특정 메뉴를 찾거나 특정 위치로 가고 싶어하면 `Maps_to`를 사용하시오. 메뉴 상세 페이지의 경우 `/menus/{slug}` 형식을 사용하시오. (예: `/menus/americano`)
    - 주문(담기)하고 싶어하면 `add_to_cart`를 사용하시오.
    - 메뉴의 정확한 슬러그 정보를 모른다면 반드시 `search_menu_by_slug`를 먼저 호출하여 정보를 확인한 뒤 다음 동작을 수행하시오.
    - **중요**: 사용자가 "아메리카노 페이지 보여주고 장바구니에도 담아줘"와 같이 여러 요청을 하면, `add_to_cart`와 `Maps_to`를 **동시에(한 응답에 여러 도구 호출)** 사용하여 한 번에 처리하고 "아메리카노 페이지로 이동하면서 장바구니에도 정성껏 담아드렸소!"와 같이 정겹게 답하십시오."""

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
