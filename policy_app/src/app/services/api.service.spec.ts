import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


  describe('ApiService', () => {
    let service: ApiService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [ApiService]
      });
      service = TestBed.inject(ApiService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should call register API', () => {
      const userData = { username: 'test', password: 'pass' };
      const mockResponse = { success: true };
      service.register(userData).subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
      const req = httpMock.expectOne('https://localhost:7225/api/User/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(userData);
      req.flush(mockResponse);
    });

    it('should call login API', () => {
      const userData = { username: 'test', password: 'pass' };
      const mockResponse = { token: 'abc' };
      service.login(userData).subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
      const req = httpMock.expectOne('https://localhost:7225/api/User/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(userData);
      req.flush(mockResponse);
    });

    it('should call checkUsername API with encoded username', () => {
      const username = 'test user';
      const mockResponse = { exists: false };
      service.checkUsername(username).subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
      const req = httpMock.expectOne('https://localhost:7225/api/User/check-username/test%20user');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call checkPolicy API', () => {
      const data = { policyNumber: '123', chassisNumber: 'abc' };
      const mockResponse = { found: true };
      service.checkPolicy(data).subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
      const req = httpMock.expectOne('https://localhost:7225/api/Policy/findPolicy/123/abc');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call addPolicy API with encoded username', () => {
      const policyNumber = '123';
      const userName = 'test user';
      const mockResponse = { added: true };
      service.addPolicy(policyNumber, userName).subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
      const req = httpMock.expectOne('https://localhost:7225/api/Policy/addpolicy/123/test%20user');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(mockResponse);
    });

    it('should call changePassword API', () => {
      const passwordData = { oldPassword: 'old', newPassword: 'new' };
      const mockResponse = { changed: true };
      service.changePassword(passwordData).subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
      const req = httpMock.expectOne('https://localhost:7225/api/User/change-password');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(passwordData);
      req.flush(mockResponse);
    });

    it('should call viewPolicyNumbers API with encoded username', () => {
      const userName = 'test user';
      const mockResponse = ['123', '456'];
      service.viewPolicyNumbers(userName).subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
      const req = httpMock.expectOne('https://localhost:7225/api/Policy/viewpolicyno/test%20user');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call viewPolicyNumbersWithStatus API with encoded username', () => {
      const userName = 'test user';
      const mockResponse = [{ policy: '123', status: true }];
      service.viewPolicyNumbersWithStatus(userName).subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
      const req = httpMock.expectOne('https://localhost:7225/api/Policy/policynostatus/test%20user');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call toggleStatus API', () => {
      const id = 1;
      const mockResponse = { toggled: true };
      service.toggleStatus(id).subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
      const req = httpMock.expectOne('https://localhost:7225/api/Policy/togglestatus?id=1');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(mockResponse);
    });

    it('should call deletePolicy API', () => {
      const id = 1;
      const mockResponse = { deleted: true };
      service.deletePolicy(id).subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
      const req = httpMock.expectOne('https://localhost:7225/api/Policy/deletepolicy/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should call policyDetails API with encoded policy number', () => {
      const policyNumber = 'POL 123';
      const mockResponse = { details: 'info' };
      service.policyDetails(policyNumber).subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
      const req = httpMock.expectOne('https://localhost:7225/api/Policy/policydetails/POL%20123');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call totalPremium API with encoded username', () => {
      const userName = 'test user';
      const mockResponse = { total: 1000 };
      service.totalPremium(userName).subscribe(res => {
        expect(res).toEqual(mockResponse);
      });
      const req = httpMock.expectOne('https://localhost:7225/api/Policy/totalpremium/test%20user');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
 
});
