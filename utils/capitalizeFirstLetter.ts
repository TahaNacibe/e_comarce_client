function capitalizeFirstLetter(pageTitle:string) {
    if (!pageTitle) return ""; 
    return pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1);
}


export default capitalizeFirstLetter