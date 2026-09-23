const API_BASE_URL = 'http://127.0.0.1:8000/api';

export async function processVoiceInput(profileData, language = 'ta') {
  try {
    const payload = typeof profileData === 'object' 
      ? { ...profileData, language } 
      : { transcript: profileData, language };

    const response = await fetch(`${API_BASE_URL}/voice/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    console.log('FastAPI Voice Process Response:', data);
    return data;
  } catch (error) {
    console.warn('FastAPI API call error, using local fallback:', error);
    return null;
  }
}

export async function fetchHeatmapData() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/heatmap`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('FastAPI Heatmap fetch error:', error);
    return null;
  }
}

export async function fetchConsultants() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/consultants`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('FastAPI Consultants fetch error:', error);
    return null;
  }
}

export async function fetchPlacements() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/placements`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('FastAPI Placements fetch error:', error);
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
    console.warn('FastAPI Plan generation error:', error);
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
    console.warn('FastAPI Assign Consultant error:', error);
    return null;
  }
}
