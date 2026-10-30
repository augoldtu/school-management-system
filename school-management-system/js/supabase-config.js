// ==========================================
// การตั้งค่าเชื่อมต่อฐานข้อมูล SUPABASE
// ==========================================
const SUPABASE_URL = "https://saiwktdgpckukcooiely.supabase.co";
// ใส่ Publishable Key ที่ได้จากหน้า API Keys ในช่องด้านล่างนี้
const SUPABASE_ANON_KEY = "sb_publishable_iPXAF8zValtaNAZe1JiHFQ_ahPfdZXJ";

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ตัวแปรร่วมสำหรับเก็บสถานะข้อมูลทั้งระบบ
let globalStudents = [];
let globalTeachers = [];
let globalTerms = [];
let currentActiveTermId = null;
const attendanceState = {};

// ฟังก์ชันแปลงรูปแบบวันที่เป็นภาษาไทย
function formatDateThai(dateString) {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return d.toLocaleDateString('th-TH', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
}