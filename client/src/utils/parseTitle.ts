const capitalize = (title:string):string => title.charAt(0).toUpperCase() + title.slice(1);

export default (title: string): string => capitalize(title.toLowerCase());