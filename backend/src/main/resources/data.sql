-- initial data for development
-- categories
INSERT INTO categories (name, icon, sort_order) VALUES
  ('전통차', '🍵', 1),
  ('디저트', '🍰', 2),
  ('커피&음료', '☕', 3),
  ('샌드위치&브런치', '🥪', 4),
  ('에이드&스무디', '🥤', 5),
  ('아이스크림&빙수', '🍦', 6),
  ('기획 상품', '🎁', 7);

-- menus
INSERT INTO menus (
    kor_name, eng_name, description, price, category_id, is_available, alt_text,
    admin_memo, allergy_info, created_at, updated_at
) VALUES
  ('명품 대추차', 'jujube tea', '정성껏 우린 대추차', 5000, 1, true, '대추차', '인기 메뉴', '대추', NOW(), NOW()),
  ('인절미 토스트', 'injeolmi toast', '쫀득한 인절미가 올라간 토스트', 7500, 2, true, '인절미 토스트', '디저트 베스트', '우유, 밀, 콩', NOW(), NOW()),
  ('흑임자 크림 라떼', 'black sesame latte', '고소한 흑임자 크림 라떼', 6500, 3, true, '흑임자 크림 라떼', 'MZ세대 타겟', '우유, 깨', NOW(), NOW()),
  ('수제 얼음 식혜', 'sikhye with ice', '직접 끓인 달콤한 식혜를 얼음과 함께', 4500, 1, true, '얼음 식혜', '여름 시즌', '쌀', NOW(), NOW()),
  ('약과 휘낭시에', 'yakgwa financier', '전통 과자 약과와 프랑스식 휘낭시에', 8000, 2, true, '약과 휘낭시에', '신메뉴 추가', '밀, 계란, 우유', NOW(), NOW()),
  ('잠봉뵈르 샌드위치', 'jambon-beurre sandwich', '프렌치 스타일 햄 버터 샌드위치', 9000, 4, true, '잠봉뵈르 샌드위치', '식사대용 인기', '밀, 우유, 돼지고기', NOW(), NOW()),
  ('아보카도 에그 토스트', 'avocado egg toast', '신선한 아보카도와 계란 토스트', 8200, 4, true, '아보카도 에그 토스트', '조리 간편', '밀, 계란', NOW(), NOW()),
  ('궁중 쌍화차', 'royal ssanghwa tea', '궁중에서 즐기던 약차', 5500, 1, true, '쌍화차', '중장년층 선호', '호두, 땅콩', NOW(), NOW()),
  ('도라지 배차', 'balloon flower pear tea', '도라지와 배가 어우러진 차', 5000, 1, true, '도라지 배차', '기관지에 좋음', '없음', NOW(), NOW()),
  ('샤인머스캣 에이드', 'shine muscat ade', '달콤한 샤인머스캣 에이드', 7000, 5, true, '샤인머스캣 에이드', '', '', NOW(), NOW()),
  ('자몽 허니 블랙티', 'grapefruit honey black tea', '자몽과 꿀이 들어간 블랙티', 6800, 5, true, '자몽 허니 블랙티', '', '', NOW(), NOW()),
  ('쑥 인절미 마카롱', 'mugwort injeolmi macaron', '쑥 향과 인절미가 들어간 마카롱', 6000, 2, true, '쑥 인절미 마카롱', '', '', NOW(), NOW()),
  ('홍시 수정과 소르베', 'persimmon sorbet with sujeonggwa', '홍시 소르베 위에 수정과 소스', 7200, 6, true, '홍시 수정과 소르베', '', '', NOW(), NOW());

-- menu_images reference static folder; Spring serves them under /images/{filename}
INSERT INTO menu_images (alt_text, menu_id, sort_order, src_url) VALUES
  ('명품 대추차 상세 이미지', 1, 1, '/images/jujube-tea.png'),
  ('인절미 토스트 상세 이미지', 2, 1, '/images/injeolmi-toast.png'),
  ('흑임자 크림 라떼 상세 이미지', 3, 1, '/images/black-sesame.png'),
  ('수제 얼음 식혜 상세 이미지', 4, 1, '/images/sikhye.png'),
  ('약과 휘낭시에 상세 이미지', 5, 1, '/images/yakgwa-fin.png'),
  ('잠봉뵈르 샌드위치 이미지', 6, 1, '/images/jambon-beurre.png'),
  ('아보카도 에그 토스트 이미지', 7, 1, '/images/avocado-egg-toast.png'),
  ('궁중 쌍화차 이미지', 8, 1, '/images/ssanghwa-cha.png'),
  ('도라지 배차 이미지', 9, 1, '/images/balloon-flower-pear-tea.png'),
  ('샤인머스캣 에이드 이미지', 10, 1, '/images/shine-muscat-ade.png'),
  ('자몽 허니 블랙티 이미지', 11, 1, '/images/grapefruit-honey-black-tea.png'),
  ('쑥 인절미 마카롱 이미지', 12, 1, '/images/mugwort-injeolmi-macaron.png'),
  ('홍시 수정과 소르베 이미지', 13, 1, '/images/persimmon-sorbet.png');

-- users (password is '1234' hashed with BCrypt)
INSERT INTO users (id, nickname, password, role) VALUES
  ('admin-uuid-001', 'admin', '$2a$10$8.UnVuG9HHgffUDAlk8q2OuVGkqBKzVxeuL9jlW6dB890wBPlK.S.', 'ROLE_ADMIN');
