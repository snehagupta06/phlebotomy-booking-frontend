const API_BASE = import.meta.env.VITE_API_URL ?? ''; 

async function handleResponse(res: Response) {
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
    return null;
  }

  if (!res.ok) {
    const msg = data?.message ?? data?.error ?? JSON.stringify(data);
    throw new Error(msg || `HTTP ${res.status}`);
  }

  return data;
}

/* Areas */
export async function fetchAreas(): Promise<any> {
  const res = await fetch(`${API_BASE}/api/areas`);
  return handleResponse(res);
}

/* Slots */
export async function fetchSlots(area_id?: string, slot_date?: string): Promise<any> {
  const q = new URLSearchParams();
  if (area_id) q.set('area_id', area_id);
  if (slot_date) q.set('slot_date', slot_date);
  const url = `${API_BASE}/api/slots${q.toString() ? `?${q.toString()}` : ''}`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function createSlot(payload: any): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/slots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

/* Admin areas */
export async function createArea(payload: any): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/areas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}


export async function createBooking(payload: {
  slot_id: string;
  user_name: string;
  user_phone?: string;
  address: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

// Fetch booking by id. Returns server JSON (expected: { booking: { ... } })
export async function fetchBooking(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/booking/${id}`);
  return handleResponse(res);
}

/* Utility: optional helper to check health or root */
export async function ping(): Promise<any> {
  const res = await fetch(`${API_BASE}/`);
  return handleResponse(res);
}

