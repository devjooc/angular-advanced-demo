import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  private timeDiffs = {
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    year: 365 * 24 * 60 * 60 * 1000
  };

  transform(value: string | Date): unknown {
    const now = Date.now();
    const then = new Date(value).getTime();
    const diff = now - then;
    if (diff < this.timeDiffs.minute) {
      return 'few seconds ago';
    } else if (diff < this.timeDiffs.hour) {
      return 'few minutes ago';
    } else if (diff < this.timeDiffs.day) {
      return 'few hours ago';
    } else if (diff < this.timeDiffs.week) {
      return 'few days ago';
    } else if (diff < this.timeDiffs.month) {
      return 'few weeks ago';
    } else if (diff < this.timeDiffs.year) {
      return 'few months ago';
    } else {
      return 'a year ago';
    }
  }

}
