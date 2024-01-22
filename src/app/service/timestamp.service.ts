import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimestampService {

  convertVideoNameToTimestamp(filename: string): string {
    return filename.split('.')[0];
  }

  convertTimestampToDescription(timestamp: string): string {
    const recordedTime = this.parseCustomTimestamp(timestamp);

    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - recordedTime.getTime();
    const seconds = Math.floor(timeDifference / 1000);

    if (seconds < 60) {
      return `Recorded ${seconds} seconds ago`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `Recorded ${minutes} minutes ago`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `Recorded ${hours} hours ago`;
    } else {
      const days = Math.floor(seconds / 86400);
      return `Recorded ${days} days ago`;
    }
  }

  parseCustomTimestamp(timestamp: string): Date {
    const parts = timestamp.split('-');

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const hour = parseInt(parts[3], 10);
    const minute = parseInt(parts[4], 10);
    const second = parseInt(parts[5], 10);

    return new Date(year, month, day, hour, minute, second);
  }

  convertSecondsToReadableAmount(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const hoursString = hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''}` : '';
    const minutesString = minutes > 0 ? `${minutes} minute${minutes !== 1 ? 's' : ''}` : '';
    const secondsString = remainingSeconds > 0 ? `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}` : '';

    const separator1 = hoursString && (minutesString || secondsString) ? ', ' : '';
    const separator2 = minutesString && secondsString ? ' and ' : '';

    return `${hoursString}${separator1}${minutesString}${separator2}${secondsString}`;
  }

}
