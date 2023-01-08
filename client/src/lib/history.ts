import api from "./api";
import { HistoryRes } from "../interfaces/res/history.res";

const BASE_HISTORY_API = `/histories`;

export const getHistory = () => {
    return api.get<HistoryRes>(`${BASE_HISTORY_API}/`,);
}