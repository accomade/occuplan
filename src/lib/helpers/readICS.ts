import type { Occupation, OccupationCallback } from "$lib/types/occupations";

export const streamEvents = async (
    url: string,
    eventCallback: OccupationCallback,
  ) :Promise<Occupation[] | undefined> => {
  
  const resp = await fetch(url)
  console.log(resp)

  return;
  /*
  if(!resp.ok) throw new Error("Not a valid ICS URL")
  if(!resp.body) throw new Error("Not a valid ICS URL")
  const reader = resp.body?.pipeThrough(new TextDecoderStream()).getReader();
  if(!reader) throw new Error("Not a valid ICS URL")

  return new Promise<Occupation[]>( (res, rej) => {
    const result:Occupation[] = []
  
    reader.read().then(
      ({ value:string, done:boolean }) => {
        console.log(string)
      })
    //return new LineReader(resp.body?.getReader())


    return result
  })
  */
}

/*
export const parseICS = ( r:Reader) => {

    const reader = resp.body?.getReader();
    
    reader.readLine( (line) => {

    })
    

  })

}
*/