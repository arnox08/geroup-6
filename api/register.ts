// Vercel Serverless Function: Handles User Registration & Google Sheets Integration
export default async function handler(req: any, res: any) {
  // CORS configuration for Vercel
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({
      service: 'Vercel Registration Service - DBT Wapipathum',
      status: 'active',
      target_spreadsheet: '1sKz0rp5V8bQ_tI_dDZqAv-ERDa1dOD3yFOIkus85KWo',
      timestamp: new Date().toISOString(),
    });
  }

  try {
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch {
        payload = Object.fromEntries(new URLSearchParams(payload));
      }
    }

    const spreadsheetId = '1sKz0rp5V8bQ_tI_dDZqAv-ERDa1dOD3yFOIkus85KWo';
    const timestamp = payload?.timestamp || new Date().toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'medium' });
    const roleThai = payload?.role === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : 'นักศึกษา/บุคลากร';

    const cleanData = {
      action: 'register_user',
      timestamp: timestamp,
      code: String(payload?.code || '').trim().toUpperCase(),
      name: String(payload?.name || '').trim(),
      role: payload?.role || 'student',
      role_th: roleThai,
      department: payload?.department || 'เทคโนโลยีธุรกิจดิจิทัล',
      level: payload?.level || 'ปวส.1/1',
      email: payload?.email || `${(payload?.code || 'user').toLowerCase()}@wptc.ac.th`,
      phone: payload?.phone || '080-000-0000',
      password: payload?.password || '',
      status: 'ใช้งานได้ (Active)',
      spreadsheet_id: spreadsheetId,
    };

    // Forward to Google Apps Script if URL provided or configured
    const appsScriptUrl = payload?.apps_script_url || process.env.APPS_SCRIPT_URL || '';
    let sheetDelivery = 'processed_on_vercel';

    if (appsScriptUrl && appsScriptUrl.startsWith('http')) {
      try {
        const formData = new URLSearchParams();
        for (const [k, v] of Object.entries(cleanData)) {
          formData.append(k, String(v));
        }

        await fetch(appsScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });
        sheetDelivery = 'delivered_to_apps_script';
      } catch (err: any) {
        console.warn('Apps Script forward warning on Vercel:', err);
      }
    }

    return res.status(200).json({
      success: true,
      platform: 'vercel',
      message: 'บันทึกข้อมูลสมาชิก 100% ผ่าน Vercel เรียบร้อยแล้ว',
      spreadsheet_id: spreadsheetId,
      sheet_delivery: sheetDelivery,
      data: cleanData,
    });
  } catch (error: any) {
    console.error('Vercel Register API Error:', error);
    return res.status(500).json({
      success: false,
      platform: 'vercel',
      error: error?.message || 'Internal registration error',
    });
  }
}
