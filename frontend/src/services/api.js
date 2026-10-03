const PRODUCTION_API_URL = 'https://livora-uf83.onrender.com/api';
const LOCAL_API_URL = 'http://127.0.0.1:8000/api';

// Dynamic API URL selection: Uses local backend when developing, Render cloud backend when deployed
const API_BASE_URL = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? LOCAL_API_URL
  : PRODUCTION_API_URL;

export async function processVoiceInput(profileData, language = 'ta') {
  try {
    const payload = typeof profileData === 'object' 
      ? { ...profileData, language } 
      : { transcript: profileData, language };

    const response = await fetch(`${API_BASE_URL}/voice/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('API call error, using local fallback:', error);
    return null;
  }
}

export async function fetchBeneficiaryProfiles() {
  try {
    const response = await fetch(`${API_BASE_URL}/voice/profiles`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Fetch profiles error:', error);
    return null;
  }
}

export async function fetchNsqfCourses() {
  try {
    const response = await fetch(`${API_BASE_URL}/nsqf/courses`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Fetch NSQF courses error:', error);
    return null;
  }
}

export async function matchNsqfCourses(profile) {
  try {
    const response = await fetch(`${API_BASE_URL}/nsqf/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Match NSQF error:', error);
    return null;
  }
}

export async function fetchSchemes() {
  try {
    const response = await fetch(`${API_BASE_URL}/schemes/all`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Fetch schemes error:', error);
    return null;
  }
}

export async function fetchTrainingCenters(district = '') {
  try {
    const url = district ? `${API_BASE_URL}/schemes/centers?district=${encodeURIComponent(district)}` : `${API_BASE_URL}/schemes/centers`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Fetch centers error:', error);
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

export async function registerConsultant(fcData) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/consultants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fcData)
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Register consultant error:', error);
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

export async function updatePlacementStatus(id, new_status, outcomeType, employerOrUnit, incomeOrSalary) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/placements/update-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        new_status,
        outcomeType,
        employerOrUnit,
        incomeOrSalary
      })
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Update placement error:', error);
    return null;
  }
}

export async function fetchPerspectivePlans() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/perspective-plans`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Fetch perspective plans error:', error);
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

export async function fetchCoordinationTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/coordination-tasks`);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Coordination tasks fetch error:', error);
    return null;
  }
}

export async function updateCoordinationTask(taskId, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/coordination-tasks/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: taskId, status })
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Update coordination task error:', error);
    return null;
  }
}

export async function groundRegisterBeneficiary(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/ground-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn('Ground register error:', error);
    return null;
  }
}
