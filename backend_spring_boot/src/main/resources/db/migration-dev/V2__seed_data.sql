INSERT INTO projects (
  code,
  name,
  logo_path,
  primary_color,
  secondary_color,
  address,
  phone,
  email,
  footer_note,
  is_active,
  receipt_extra_schema,
  receipt_seq
) VALUES (
  'ideabotkey',
  'IdeabotKey',
  NULL,
  '#1f2937',
  '#14b8a6',
  '123 Main Street, Pune',
  '+91-9999999999',
  'hello@ideabotkey.com',
  'Thanks for your business!',
  1,
  JSON_ARRAY(
    JSON_OBJECT('key','vehicleNo','label','Vehicle No','type','string','required',true),
    JSON_OBJECT('key','deliveryDate','label','Delivery Date','type','date','required',false),
    JSON_OBJECT('key','isPaid','label','Paid?','type','boolean','required',false),
    JSON_OBJECT('key','source','label','Source','type','enum','required',false,'options',JSON_ARRAY('Walkin','Online','Phone'))
  ),
  1
);

INSERT INTO receipts (
  project_id,
  receipt_no,
  date_time,
  customer_name,
  customer_phone,
  payment_mode,
  subtotal,
  discount,
  tax,
  grand_total,
  notes,
  extra_data
) VALUES (
  (SELECT id FROM projects WHERE code = 'ideabotkey'),
  1,
  NOW(),
  'Aarav Sharma',
  '9000000000',
  'UPI',
  1200.00,
  100.00,
  90.00,
  1190.00,
  'First sample receipt',
  JSON_OBJECT('vehicleNo','MH14AB1234','deliveryDate','2026-01-18','isPaid',true,'source','Online')
);

INSERT INTO receipt_items (
  receipt_id,
  item_name,
  qty,
  unit_price,
  line_total
) VALUES
  ((SELECT id FROM receipts WHERE receipt_no = 1 AND project_id = (SELECT id FROM projects WHERE code = 'ideabotkey')), 'Service A', 1.000, 800.00, 800.00),
  ((SELECT id FROM receipts WHERE receipt_no = 1 AND project_id = (SELECT id FROM projects WHERE code = 'ideabotkey')), 'Service B', 2.000, 200.00, 400.00);
