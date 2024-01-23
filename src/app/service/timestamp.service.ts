import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimestampService {

  /**
   * Adds an amount of seconds to a timestamp and returns it into a real time format
   * @param timestamp in milliseconds
   * @param secondsToAdd
   */
  public addSecondsToTimestamp(timestamp: string, secondsToAdd: number): Date {
    timestamp = this.convertVideoNameToTimestamp(timestamp);
    const recordedTime = this.parseCustomTimestamp(timestamp);
    return new Date(recordedTime.getTime() + secondsToAdd)
  }

  /**
   * Convert a video file name to a timestamp by removing the file extension part
   * @param filename string in format day-month-year-hour-minutes-seconds.extension
   */
  public convertVideoNameToTimestamp(filename: string): string {
    return filename.split('.')[0];
  }

  /**
   * Converts a timestamp to a recorded description
   * The description will be either seconds, minutes, hours or days depending on how long ago it was
   * Example input: 15-12-2023-14-50-43
   * Example returned format: Recorded 2 days ago
   * @param timestamp string in format day-month-year-hour-minutes-seconds
   */
  public convertTimestampToDescription(timestamp: string): string {
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

  /**
   * Converts a number in milliseconds to a video timestamp
   * Example: 2000 -> 00:02
   * @param timestamp in milliseconds
   */
  public convertNumberToVideoTimestamp(timestamp: number): string {
    const seconds = Math.floor(timestamp / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  /**
   * Converts a timestamp to a real time format
   * Example returned format: 15-12-2023 14:50:43
   * @param timestamp
   */
  public convertTimestampToRealTimeFormat(timestamp: Date): string {
    const year = timestamp.getFullYear();
    const month = (timestamp.getMonth() + 1).toString().padStart(2, '0');
    const day = timestamp.getDate().toString().padStart(2, '0');
    const hour = timestamp.getHours().toString().padStart(2, '0');
    const minute = timestamp.getMinutes().toString().padStart(2, '0');
    const second = timestamp.getSeconds().toString().padStart(2, '0');

    return `${day}-${month}-${year} ${hour}:${minute}:${second}`
  }

  /**
   * Converts a timestamp to a Date object
   * @param timestamp string in format day-month-year-hour-minutes-seconds
   */
  public parseCustomTimestamp(timestamp: string): Date {
    const parts = timestamp.split('-');

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const hour = parseInt(parts[3], 10);
    const minute = parseInt(parts[4], 10);
    const second = parseInt(parts[5], 10);

    return new Date(year, month, day, hour, minute, second);
  }

}
