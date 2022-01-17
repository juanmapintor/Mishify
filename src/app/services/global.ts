import {HttpHeaders} from "@angular/common/http";

export const GLOBAL = {
  API_URL: 'http://localhost:3977/api/',
  JSON_HEADERS: {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      }
    )
  }
};
