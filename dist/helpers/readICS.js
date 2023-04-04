import { DateTime as lx } from 'luxon';
export const getEvents = async (url, eventCallback) => {
    const resp = await fetch(url);
    const text = await resp.text();
    if (!resp.ok)
        throw new Error("Not a valid ICS URL");
    let insideEvent = false;
    let arrival = "";
    let leave = "";
    text.split(/\r?\n/).forEach((line) => {
        switch (true) {
            case /^BEGIN:VEVENT$/.test(line):
                insideEvent = true;
                break;
            case /^DTSTART;VALUE=.*/.test(line) && insideEvent:
                arrival = line;
                break;
            case /^DTEND;VALUE=.*/.test(line) && insideEvent:
                leave = line;
                break;
            case /^END:VEVENT$/.test(line) && insideEvent:
                insideEvent = false;
                eventCallback({
                    arrival: getDate(arrival),
                    leave: getDate(leave),
                });
                break;
        }
    });
};
const getDate = (icsLine) => {
    //e.g. DTEND;VALUE=DATE:20260818
    const [typePart, valuePart] = icsLine.split("=");
    const dateString = valuePart.split(":")[1];
    let rawDateTime = lx.fromISO(dateString);
    //end date has to be moved back when whole day ending
    if (/^DTEND;VALUE$/.test(typePart)) {
        if (rawDateTime.hour == 0 &&
            rawDateTime.minute == 0 &&
            rawDateTime.second == 0 &&
            rawDateTime.millisecond == 0) {
            rawDateTime = rawDateTime.minus({ hour: 12 });
        }
    }
    //normalize to noon
    return rawDateTime.set({ hour: 12, minute: 0, second: 0, millisecond: 0 });
};
