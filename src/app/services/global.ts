import {HttpHeaders} from "@angular/common/http";

export const GLOBAL = {
  API_URL: 'https://mishify-api.herokuapp.com/api/',
  JSON_HEADERS: {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      }
    )
  }
};
