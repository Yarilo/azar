export default (event:any) => `#${encodeURI(event.title.replace(new RegExp(' ', 'g'),''))}`
