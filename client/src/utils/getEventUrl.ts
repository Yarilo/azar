export default (event:any) => `#${event.title.replace(new RegExp(' ', 'g'),'')}`
