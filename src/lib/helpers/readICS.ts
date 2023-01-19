import type { Occupation } from "$lib/types/occupations";

const url = "https://calendar.google.com/calendar/ical/0512a05fa900ee7118de13a14d5244d3ebe2eba056af845e76996e6b9c4f885c%40group.calendar.google.com/public/basic.ics"

export const fetchICS = async ( u:URL ):Promise<ReadableStreamDefaultReader|undefined> => {
  const resp = await fetch(url)
  return resp.body?.pipeThrough(new TextDecoderStream()).getReader();
}

export const streamEvents = (
    reader: ReadableStreamDefaultReader,
    eventCallback: VoidFunction,
  ) :Promise<Occupation[]> => {
  
  return new Promise<Occupation[]>( (res, rej) => {
    const result:Occupation[] = []
  
    reader.read().then(
      ({ value:string, done:boolean }) => {
        console.log(string)
      })
    //return new LineReader(resp.body?.getReader())


    return result
  })
}

/*
export const parseICS = ( r:Reader) => {

    const reader = resp.body?.getReader();
    
    reader.readLine( (line) => {

    })
    

  })

}
*/