import { TestBed } from '@angular/core/testing';

import { EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should emit initial value 0 and then emit new welcome message', (done) => {
  const emittedValues: number[] = [];
  const testValue = 1;

  service.welMsgs.subscribe((value) => {
    emittedValues.push(value);

    
    if (emittedValues.length === 2) {
      expect(emittedValues[0]).toBe(0);     
      expect(emittedValues[1]).toBe(testValue); 
      done();
    }
  });

  service.sendWelcomeMessage(testValue);
});

});
