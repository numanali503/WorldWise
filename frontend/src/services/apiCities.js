// frontend/src/services/apiCities.js

const BASE_URL = "http://localhost:3000/api";

export async function getCities() {
  try {
    const res = await fetch(`${BASE_URL}/cities`);
    if (!res.ok) throw Error("Failed getting cities");
    const data = await res.json();
    return data;
  } catch (error) {
    throw Error("Failed getting cities");
  }
}

export async function getCity(id) {
  try {
    const res = await fetch(`${BASE_URL}/cities/${id}`);
    if (!res.ok) throw Error("Failed getting city");
    const data = await res.json();
    return data;
  } catch (error) {
    throw Error("Failed getting city");
  }
}

export async function createCity(newCity) {
  try {
    const res = await fetch(`${BASE_URL}/cities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCity),
    });
    if (!res.ok) throw Error("Failed creating city");
    const data = await res.json();
    return data;
  } catch (error) {
    throw Error("Failed creating city");
  }
}

export async function deleteCity(id) {
  try {
    const res = await fetch(`${BASE_URL}/cities/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw Error("Failed deleting city");
    return res.json();
  } catch (error) {
    throw Error("Failed deleting city");
  }
}