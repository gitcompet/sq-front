import { HttpHeaders } from "@angular/common/http";

export const headers = new HttpHeaders()
.set('content-type', 'application/json')
// .set('Access-Control-Allow-Origin', '*')
// .set('Access-Control-Allow-Origin', 'http://localhost:4200')
.append('content-type', 'text/plain; charset=utf-8')
.append('content-type', 'application/x-www-form-urlencoded');
