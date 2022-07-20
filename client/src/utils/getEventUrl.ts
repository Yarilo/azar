export default (event: any) => `today/${encodeURI(event.title.replace(new RegExp(' ', 'g'), ''))}`
