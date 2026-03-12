-- initial data (idempotent: safe to run on every restart)

-- 1) categories (name is unique-ish, use ON CONFLICT on generated id – so we guard with DO NOTHING via a check)
INSERT INTO categories (name, icon, sort_order)
SELECT v.name, v.icon, v.sort_order
FROM (VALUES
  ('전통차',           '🍵', 1),
  ('디저트',           '🍰', 2),
  ('커피&음료',        '☕', 3),
  ('샌드위치&브런치',  '🥪', 4),
  ('에이드&스무디',    '🥤', 5),
  ('아이스크림&빙수',  '🍦', 6),
  ('기획 상품',        '🎁', 7)
) AS v(name, icon, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM categories c WHERE c.name = v.name);

-- 2) menus (use category name lookup, guard by kor_name uniqueness)
INSERT INTO menus (
    kor_name, eng_name, description, price, slug, allergy_info, 
    category_id, is_available, alt_text, admin_memo, created_at, updated_at
)
SELECT 
    v.kor_name, v.eng_name, v.description, v.price, v.slug, v.allergy_info,
    (SELECT c.id FROM categories c WHERE c.name = v.cat_name LIMIT 1),
    true, v.alt_text, v.admin_memo, NOW(), NOW()
FROM (VALUES
  ('햄 치즈 샌드위치', 'ham cheese sandwich', '햄과 치즈가 들어간 샌드위치', 6000, 'ham-cheese-sandwich', '밀, 계란, 우유', '샌드위치&브런치', '햄 치즈 샌드위치', '기본 메뉴'),
  ('베이글 크림 치즈', 'bagel cream cheese', '베이글에 크림 치즈를 바른 샌드위치', 5000, 'bagel-cream-cheese', '밀, 계란, 우유', '샌드위치&브런치', '베이글 크림 치즈', '기본 메뉴'),
  ('스크램블 에그 샌드위치', 'scrambled egg sandwich', '스크램블 에그가 들어간 샌드위치', 7000, 'scrambled-egg-sandwich', '밀, 계란, 우유', '샌드위치&브런치', '스크램블 에그 샌드위치', '기본 메뉴'),
  ('두바이 쫀득 쿠키', 'dubai zzondeuk cookie', '쫀득한 식감의 쿠키', 2000, 'dubai-zzondeuk-cookie', '밀, 계란, 우유', '디저트', '두바이 쫀득 쿠키', '기본 메뉴'),
  ('초콜릿 무스', 'chocolate mousse', '진한 초콜릿 무스', 4000, 'chocolate-mousse', '밀, 계란, 우유', '디저트', '초콜릿 무스', '기본 메뉴'),
  ('초콜릿 크로와상', 'chocolate croissant', '초콜릿이 들어간 크로와상', 4000, 'chocolate-croissant', '밀, 계란, 우유', '디저트', '초콜릿 크로와상', '기본 메뉴'),
  ('초코칩 쿠키', 'choco chip cookie', '초코칩이 들어간 쿠키', 2000, 'choco-chip-cookie', '밀, 계란, 우유', '디저트', '초코칩 쿠키', '기본 메뉴'),
  ('버터 쿠키', 'butter cookie', '버터가 들어간 쿠키', 2000, 'butter-cookie', '밀, 계란, 우유', '디저트', '버터 쿠키', '기본 메뉴'),
  ('아몬드 쿠키', 'almond cookie', '아몬드가 들어간 쿠키', 2000, 'almond-cookie', '밀, 계란, 우유', '디저트', '아몬드 쿠키', '기본 메뉴'),
  ('바나나 라떼', 'banana latte', '바나나와 우유가 들어간 라떼', 5000, 'banana-latte', '우유', '커피&음료', '바나나 라떼', '기본 메뉴'),
  ('에스프레소', 'espresso', 'espresso', 3500, 'espresso', '없음', '커피&음료', '에스프레소', '기본 메뉴'),
  ('아메리카노', 'Americano', '진한 에스프레소와 물의 조화', 4500, 'americano', '없음', '커피&음료', '아메리카노', '기본 메뉴'),
  ('카페 라떼', 'Caffè Latte', '부드러운 우유와 에스프레소의 조화', 5000, 'caffè-latte', '우유', '커피&음료', '카페 라떼', '기본 메뉴'),
  ('카라멜 마키아또', 'Caramel Macchiato', '달콤한 카라멜 시럽과 에스프레소의 조화', 5500, 'caramel-macchiato', '우유, 대두', '커피&음료', '카라멜 마키아또', '기본 메뉴'),
  ('카푸치노', 'Cappuccino', '부드러운 우유 거품과 에스프레소의 조화', 5000, 'cappuccino', '우유', '커피&음료', '카푸치노', '기본 메뉴'),
  ('명품 대추차', 'jujube tea', '정성껏 우린 대추차', 5000, 'jujube-tea', '대추', '전통차', '대추차', '인기 메뉴'),
  ('인절미 토스트', 'injeolmi toast', '쫀득한 인절미가 올라간 토스트', 7500, 'injeolmi-toast', '우유, 밀, 콩', '디저트', '인절미 토스트', '디저트 베스트'),
  ('흑임자 크림 라떼', 'black sesame latte', '고소한 흑임자 크림 라떼', 6500, 'black-sesame-latte', '우유, 깨', '커피&음료', '흑임자 크림 라떼', 'MZ세대 타겟'),
  ('수제 얼음 식혜', 'sikhye with ice', '직접 끓인 달콤한 식혜를 얼음과 함께', 4500, 'sikhye-with-ice', '쌀', '전통차', '얼음 식혜', '여름 시즌'),
  ('약과 휘낭시에', 'yakgwa financier', '전통 과자 약과와 프랑스식 휘낭시에', 8000, 'yakgwa-financier', '밀, 계란, 우유', '디저트', '약과 휘낭시에', '신메뉴 추가'),
  ('잠봉뵈르 샌드위치', 'jambon-beurre sandwich', '프렌치 스타일 햄 버터 샌드위치', 9000, 'jambon-beurre-sandwich', '밀, 우유, 돼지고기', '샌드위치&브런치', '잠봉뵈르 샌드위치', '식사대용 인기'),
  ('아보카도 에그 토스트', 'avocado egg toast', '신선한 아보카도와 계란 토스트', 8200, 'avocado-egg-toast', '밀, 계란', '샌드위치&브런치', '아보카도 에그 토스트', '조리 간편'),
  ('궁중 쌍화차', 'royal ssanghwa tea', '궁중에서 즐기던 약차', 5500, 'royal-ssanghwa-tea', '호두, 땅콩', '전통차', '쌍화차', '중장년층 선호'),
  ('도라지 배차', 'balloon flower pear tea', '도라지와 배가 어우러진 차', 5000, 'balloon-flower-pear-tea', '없음', '전통차', '도라지 배차', '기관지에 좋음'),
  ('샤인머스캣 에이드', 'shine muscat ade', '달콤한 샤인머스캣 에이드', 7000, 'shine-muscat-ade', '', '에이드&스무디', '샤인머스캣 에이드', ''),
  ('자몽 허니 블랙티', 'grapefruit honey black tea', '자몽과 꿀이 들어간 블랙티', 6800, 'grapefruit-honey-black-tea', '', '에이드&스무디', '자몽 허니 블랙티', ''),
  ('쑥 인절미 마카롱', 'mugwort injeolmi macaron', '쑥 향과 인절미가 들어간 마카롱', 6000, 'mugwort-injeolmi-macaron', '', '디저트', '쑥 인절미 마카롱', ''),
  ('홍시 수정과 소르베', 'persimmon sorbet with sujeonggwa', '홍시 소르베 위에 수정과 소스', 7200, 'persimmon-sorbet-with-sujeonggwa', '', '아이스크림&빙수', '홍시 수정과 소르베', ''),
  ('이미지 준비중 메뉴', 'Image Pending Menu', '현재 이미지를 준비 중인 메뉴입니다.', 3000, 'image-pending-menu', '없음', '기획 상품', '이미지 준비중', '테스트용')
) AS v(kor_name, eng_name, description, price, slug, allergy_info, cat_name, alt_text, admin_memo)
WHERE NOT EXISTS (SELECT 1 FROM menus m WHERE m.kor_name = v.kor_name);

-- 3) menu_images (use menu kor_name lookup, guard by menu_id + sort_order)
INSERT INTO menu_images (alt_text, menu_id, sort_order, src_url)
SELECT v.alt_text,
       (SELECT m.id FROM menus m WHERE m.kor_name = v.menu_name LIMIT 1),
       1, v.src_url
FROM (VALUES
  ('햄 치즈 샌드위치 이미지', '햄 치즈 샌드위치', '/images/ham-cheese-sandwich.png'),
  ('베이글 크림 치즈 이미지', '베이글 크림 치즈', '/images/bagel-cream-cheese.png'),
  ('스크램블 에그 샌드위치 이미지', '스크램블 에그 샌드위치', '/images/scrambled-egg-sandwich.png'),
  ('두바이 쫀득 쿠키 이미지', '두바이 쫀득 쿠키', '/images/dubai-zzondeuk-cookie.png'),
  ('초콜릿 무스 이미지', '초콜릿 무스', '/images/chocolate-mousse.png'),
  ('초콜릿 크로와상 이미지', '초콜릿 크로와상', '/images/chocolate-croissant.png'),
  ('초코칩 쿠키 이미지', '초코칩 쿠키', '/images/choco-chip-cookie.png'),
  ('버터 쿠키 이미지', '버터 쿠키', '/images/butter-cookie.png'),
  ('아몬드 쿠키 이미지', '아몬드 쿠키', '/images/almond-cookie.png'),
  ('바나나 라떼 이미지', '바나나 라떼', '/images/bananalatte.png'),
  ('에스프레소 이미지', '에스프레소', '/images/espresso.png'),
  ('아메리카노 이미지', '아메리카노', '/images/americano.png'),
  ('카페 라떼 이미지', '카페 라떼', '/images/cafelatte.png'),
  ('카라멜 마키아또 이미지', '카라멜 마키아또', '/images/caramel-macchiato.png'),
  ('카푸치노 이미지', '카푸치노', '/images/capuchino.png'),
  ('명품 대추차 상세 이미지',       '명품 대추차',       '/images/jujube-tea.png'),
  ('인절미 토스트 상세 이미지',     '인절미 토스트',     '/images/injeolmi-toast.png'),
  ('흑임자 크림 라떼 상세 이미지',  '흑임자 크림 라떼',  '/images/black-sesame.png'),
  ('수제 얼음 식혜 상세 이미지',    '수제 얼음 식혜',    '/images/sikhye.png'),
  ('약과 휘낭시에 상세 이미지',     '약과 휘낭시에',     '/images/yakgwa-fin.png'),
  ('잠봉뵈르 샌드위치 이미지',      '잠봉뵈르 샌드위치', '/images/jambon-beurre.png'),
  ('아보카도 에그 토스트 이미지',   '아보카도 에그 토스트','/images/avocado-egg-toast.png'),
  ('궁중 쌍화차 이미지',            '궁중 쌍화차',       '/images/ssanghwa-cha.png'),
  ('도라지 배차 이미지',            '도라지 배차',       '/images/balloon-flower-pear-tea.png'),
  ('샤인머스캣 에이드 이미지',      '샤인머스캣 에이드', '/images/shine-muscat-ade.png'),
  ('자몽 허니 블랙티 이미지',       '자몽 허니 블랙티',  '/images/grapefruit-honey-black-tea.png'),
  ('쑥 인절미 마카롱 이미지',       '쑥 인절미 마카롱',  '/images/mugwort-injeolmi-macaron.png'),
  ('홍시 수정과 소르베 이미지',     '홍시 수정과 소르베', '/images/persimmon-sorbet.png')
) AS v(alt_text, menu_name, src_url)
WHERE NOT EXISTS (
  SELECT 1 FROM menu_images mi
  JOIN menus m ON mi.menu_id = m.id
  WHERE m.kor_name = v.menu_name AND mi.sort_order = 1
);

-- 4) additional menu images (sort_order = 2)
INSERT INTO menu_images (alt_text, menu_id, sort_order, src_url)
SELECT v.alt_text,
       (SELECT m.id FROM menus m WHERE m.kor_name = v.menu_name LIMIT 1),
       2, v.src_url
FROM (VALUES
  ('햄 치즈 샌드위치 상세 이미지', '햄 치즈 샌드위치', '/images/ham-cheese-sandwich1.png'),
  ('베이글 크림 치즈 상세 이미지', '베이글 크림 치즈', '/images/bagel-cream-cheese1.png'),
  ('스크램블 에그 샌드위치 상세 이미지', '스크램블 에그 샌드위치', '/images/scrambled-egg-sandwich1.png'),
  ('두바이 쫀득 쿠키 상세 이미지', '두바이 쫀득 쿠키', '/images/dubai-zzondeuk-cookie1.png'),
  ('초콜릿 무스 상세 이미지', '초콜릿 무스', '/images/chocolate-mousse1.png'),
  ('초콜릿 크로와상 상세 이미지', '초콜릿 크로와상', '/images/chocolate- croissant1.png'),
  ('초코칩 쿠키 상세 이미지', '초코칩 쿠키', '/images/choco-chip-cookie1.png'),
  ('버터 쿠키 상세 이미지', '버터 쿠키', '/images/butter-cookie1.png'),
  ('아몬드 쿠키 상세 이미지', '아몬드 쿠키', '/images/almond-cookie1.png'),
  ('바나나 라떼 상세 이미지', '바나나 라떼', '/images/bananalatte1.png'),
  ('에스프레소 상세 이미지', '에스프레소', '/images/espresso1.png'),
  ('아메리카노 상세 이미지', '아메리카노', '/images/americano1.png'),
  ('카페 라떼 상세 이미지', '카페 라떼', '/images/cafelatte1.png'),
  ('카라멜 마키아또 상세 이미지', '카라멜 마키아또', '/images/caramel-macchiato1.png'),
  ('카푸치노 상세 이미지', '카푸치노', '/images/capuchino1.png')
) AS v(alt_text, menu_name, src_url)
WHERE NOT EXISTS (
  SELECT 1 FROM menu_images mi
  JOIN menus m ON mi.menu_id = m.id
  WHERE m.kor_name = v.menu_name AND mi.sort_order = 2
);

-- admin user is created by AdminInitializer.java (ensures correct BCrypt hash)

-- 5) menu_options
INSERT INTO menu_options (name, value, price)
SELECT v.name, v.value, v.price
FROM (VALUES
  ('온도', 'HOT', 0),
  ('온도', 'ICE', 0),
  ('사이즈', 'Regular', 0),
  ('사이즈', 'Large', 1000),
  ('추가 선택', '샷 추가', 500),
  ('추가 선택', '휘핑 추가', 500),
  ('추가 선택', '시럽 추가', 500),
  ('포장 선택', '매장 취식', 0),
  ('포장 선택', '박스 포장', 500)
) AS v(name, value, price)
WHERE NOT EXISTS (SELECT 1 FROM menu_options mo WHERE mo.name = v.name AND mo.value = v.value);
