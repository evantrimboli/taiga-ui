import {Inject, Pipe, PipeTransform} from '@angular/core';
import {TUI_MONTHS, TuiDay, TuiDayRange, TuiMonth} from '@taiga-ui/cdk';

@Pipe({
    name: 'labels',
})
export class LabelsPipe implements PipeTransform {
    constructor(@Inject(TUI_MONTHS) private readonly months: ReadonlyArray<string>) {}

    transform({from, to}: TuiDayRange): ReadonlyArray<string> {
        const length = TuiDay.lengthBetween(from, to);

        if (length > 90) {
            return Array.from(
                {length: TuiMonth.lengthBetween(from, to) + 1},
                (_, i) => this.months[from.append({month: i}).month],
            );
        }

        const range = Array.from({length}, (_, day) => from.append({day}));
        const mondays = onlyMondays(range);
        const days = range.map(String);

        if (length > 60) {
            return even(mondays);
        }

        if (length > 14) {
            return mondays;
        }

        if (length > 7) {
            return even(days);
        }

        return days;
    }
}

function onlyMondays(range: ReadonlyArray<TuiDay>): ReadonlyArray<string> {
    return range.filter(day => !day.dayOfWeek()).map(String);
}

function even<T>(array: ReadonlyArray<T>): ReadonlyArray<T> {
    return array.filter((_, i) => !(i % 2));
}
