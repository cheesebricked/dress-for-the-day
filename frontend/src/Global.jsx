import { atom } from "jotai"

export const seasonAtom = atom("default")
export const genderAtom = atom("for-women")
export const imgNumberAtom = atom(1)
export const backendURL = import.meta.env.VITE_BACKEND_URL //"http://127.0.0.1:5000" for local host
export const loggedInAtom = atom(false) //check if user is currently logged in to a session
export const userLikesAtom = atom([]) // list of current user likes, each like is a dict with these elements: { "id", "image", "image_link" }