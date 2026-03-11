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
5. **[페르소나]**: 손님을 '선비님' 혹은 '아씨'이라 부르며 극진히 대접하는 마음을 담으십시오."""
from google.genai import types

async def chat(messages: list, system_instruction: str = None) -> str:
    if system_instruction is None:
        system_instruction = get_system_instruction()
        
    response = await client.aio.models.generate_content(
        model=MODEL_NAME,
        contents=messages,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            max_output_tokens=2048,  # 답변 길이를 충분히 확보
            temperature=0.7,
            safety_settings=SAFETY_SETTINGS
        )
    )
    return response.text

async def chat_stream(messages: list, system_instruction: str = None) -> AsyncGenerator[str, None]:
    if system_instruction is None:
        system_instruction = get_system_instruction()

    response = await client.aio.models.generate_content_stream(
        model=MODEL_NAME,
        contents=messages,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            max_output_tokens=2048,
            temperature=0.7,
            safety_settings=SAFETY_SETTINGS
        )
    )
    async for chunk in response:
        if chunk.text:
            yield chunk.text
