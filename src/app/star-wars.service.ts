import { LogService } from './log.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Response, Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class StarWarsService {

  private characters = [
    { name: 'Luke Skywalker', side: ''},
    { name: 'Darth Vader', side: ''},
    { name: 'Obi-Wan Kenobi', side: ''}
  ];

  private logService: LogService;
  charactersChanged = new Subject<void>();
  http: HttpClient;

  constructor(logService: LogService, http: HttpClient) {
    this.logService = logService;
    this.http = http;
  }

  fetchCharacters() {
    this.http.get('https://swapi.co/api/people/')
    .subscribe((response: any) => {
      const chars = response.results.map((char) => {
        return {name: char.name, side: ''};
      });
      this.characters = chars;
      this.charactersChanged.next();
    });
  }

  getCharacters(chosenList) {
    if (chosenList === 'all') {
      return this.characters.slice();
    }
    return this.characters.filter((char) => {
      return char.side === chosenList;
    });
  }

  onSideChosen(charInfo) {
    const pos = this.characters.findIndex((char) => {
      return char.name === charInfo.name;
    });
    this.characters[pos].side = charInfo.side;
    this.charactersChanged.next(); // the changed value is emitted here
    this.logService.writeLog('Changed side of ' + charInfo.name + ', new side ' + charInfo.side);
  }

  addNewCharacter(name, side) {
    const pos = this.characters.findIndex((char) => {
      return char.name.toLocaleLowerCase() === name.toLocaleLowerCase();
    });
    if (pos !== -1) {
      return;
    }
    this.characters.push({name, side});
  }
}

