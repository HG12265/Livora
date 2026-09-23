const PRODUCTION_API_URL = 'https://livora-uf83.onrender.com/api';
const LOCAL_API_URL = 'http://127.0.0.1:8000/api';

// Dynamic API URL selection: Uses Render live cloud backend when deployed, local backend when developing
const API_BASE_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? LOCAL_API_URL
  : PRODUCTION_API_URL;

export async function processVoiceInput(profileData, language = 'ta') {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const payload = typeof profileData === 'object' 
      ? { ...profileData, language } 
      : { transcript: profileData, language };

    const response = await fetch(`${API_BASE_URL}/voice/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn('API call error/timeout, using client fallback:', error);
    return null;
  }
}

export async function fetchHeatmapData() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/heatmap`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Heatmap fetch error:', error);
    return null;
  }
}

export async function fetchConsultants() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/consultants`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Consultants fetch error:', error);
    return null;
  }
}

export async function fetchPlacements() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/placements`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Placements fetch error:', error);
    return null;
  }
}

export async function generatePerspectivePlan(district, state) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/generate-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ district, state }),
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Plan generation error:', error);
    return null;
  }
}

export async function assignConsultant(beneficiaryId, beneficiaryName, consultantName, district) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/assign-consultant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        beneficiary_id: beneficiaryId,
        beneficiary_name: beneficiaryName,
        consultant_name: consultantName,
        district: district
      }),
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Assign Consultant error:', error);
    return null;
  }
}
