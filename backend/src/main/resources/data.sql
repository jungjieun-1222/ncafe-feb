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
INSERT INTO menus (kor_name, eng_name, description, price, category_id, is_available, alt_text, admin_memo, allergy_info, created_at, updated_at)
SELECT v.kor_name, v.eng_name, v.description, v.price,
       (SELECT c.id FROM categories c WHERE c.name = v.cat_name LIMIT 1),
       true, v.alt_text, v.admin_memo, v.allergy_info, NOW(), NOW()
FROM (VALUES
  ('명품 대추차',       'jujube tea',                      '정성껏 우린 대추차',                    5000, '전통차',          '대추차',             '인기 메뉴',     '대추'),
  ('인절미 토스트',     'injeolmi toast',                  '쫀득한 인절미가 올라간 토스트',          7500, '디저트',          '인절미 토스트',      '디저트 베스트', '우유, 밀, 콩'),
  ('흑임자 크림 라떼',  'black sesame latte',              '고소한 흑임자 크림 라떼',                6500, '커피&음료',       '흑임자 크림 라떼',   'MZ세대 타겟',   '우유, 깨'),
  ('수제 얼음 식혜',    'sikhye with ice',                 '직접 끓인 달콤한 식혜를 얼음과 함께',    4500, '전통차',          '얼음 식혜',          '여름 시즌',     '쌀'),
  ('약과 휘낭시에',     'yakgwa financier',                '전통 과자 약과와 프랑스식 휘낭시에',     8000, '디저트',          '약과 휘낭시에',      '신메뉴 추가',   '밀, 계란, 우유'),
  ('잠봉뵈르 샌드위치', 'jambon-beurre sandwich',          '프렌치 스타일 햄 버터 샌드위치',         9000, '샌드위치&브런치', '잠봉뵈르 샌드위치',  '식사대용 인기', '밀, 우유, 돼지고기'),
  ('아보카도 에그 토스트','avocado egg toast',             '신선한 아보카도와 계란 토스트',          8200, '샌드위치&브런치', '아보카도 에그 토스트','조리 간편',     '밀, 계란'),
  ('궁중 쌍화차',       'royal ssanghwa tea',              '궁중에서 즐기던 약차',                  5500, '전통차',          '쌍화차',             '중장년층 선호', '호두, 땅콩'),
  ('도라지 배차',       'balloon flower pear tea',         '도라지와 배가 어우러진 차',              5000, '전통차',          '도라지 배차',        '기관지에 좋음', '없음'),
  ('샤인머스캣 에이드', 'shine muscat ade',                '달콤한 샤인머스캣 에이드',               7000, '에이드&스무디',   '샤인머스캣 에이드',  '',              ''),
  ('자몽 허니 블랙티',  'grapefruit honey black tea',     '자몽과 꿀이 들어간 블랙티',              6800, '에이드&스무디',   '자몽 허니 블랙티',   '',              ''),
  ('쑥 인절미 마카롱',  'mugwort injeolmi macaron',       '쑥 향과 인절미가 들어간 마카롱',         6000, '디저트',          '쑥 인절미 마카롱',   '',              ''),
  ('홍시 수정과 소르베','persimmon sorbet with sujeonggwa','홍시 소르베 위에 수정과 소스',           7200, '아이스크림&빙수', '홍시 수정과 소르베', '',              '')
) AS v(kor_name, eng_name, description, price, cat_name, alt_text, admin_memo, allergy_info)
WHERE NOT EXISTS (SELECT 1 FROM menus m WHERE m.kor_name = v.kor_name);

-- 3) menu_images (use menu kor_name lookup, guard by menu_id + sort_order)
INSERT INTO menu_images (alt_text, menu_id, sort_order, src_url)
SELECT v.alt_text,
       (SELECT m.id FROM menus m WHERE m.kor_name = v.menu_name LIMIT 1),
       1, v.src_url
FROM (VALUES
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

-- 4) admin user
INSERT INTO users (id, nickname, password, role)
SELECT 'admin-uuid-001', 'admin', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqBKzVxeuL9jlW6dB890wBPlK.S.', 'ROLE_ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.nickname = 'admin');
