const getDriverImageUrl = (firstName: string, lastName: string) => {
    const firstPart = firstName.slice(0, 3).toLowerCase();
    const lastPart = lastName.slice(0, 3).toLowerCase();
    return `https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_auto/content/dam/fom-website/2018-redesign-assets/drivers/2025/${firstPart}${lastPart}01.png`;
};

export const drivers = [
    { number: 81, firstName: "Oscar", lastName: "Piastri", team: "McLaren", teamColor: "#F47600", img: getDriverImageUrl("Oscar", "Piastri"), position: 1, countryCode: "AU", countryCodeISO: "au" },
    { number: 4, firstName: "Lando", lastName: "Norris", team: "McLaren", teamColor: "#F47600", img: getDriverImageUrl("Lando", "Norris"), position: 2, countryCode: "GB", countryCodeISO: "gb" },
    { number: 16, firstName: "Charles", lastName: "Leclerc", team: "Ferrari", teamColor: "#ED1131", img: getDriverImageUrl("Charles", "Leclerc"), position: 3, countryCode: "MC", countryCodeISO: "mc" },
    { number: 44, firstName: "Lewis", lastName: "Hamilton", team: "Ferrari", teamColor: "#ED1131", img: getDriverImageUrl("Lewis", "Hamilton"), position: 4, countryCode: "GB", countryCodeISO: "gb" },
    { number: 63, firstName: "George", lastName: "Russell", team: "Mercedes", teamColor: "#00D7B6", img: getDriverImageUrl("George", "Russell"), position: 5, countryCode: "GB", countryCodeISO: "gb" },
    { number: 14, firstName: "Kimi", lastName: "Antonelli", team: "Mercedes", teamColor: "#00D7B6", img: getDriverImageUrl("Kimi", "Antonelli"), position: 6, countryCode: "IT", countryCodeISO: "it" },
    { number: 1, firstName: "Max", lastName: "Verstappen", team: "Red Bull Racing", teamColor: "#4781D7", img: getDriverImageUrl("Max", "Verstappen"), position: 7, countryCode: "NL", countryCodeISO: "nl" },
    { number: 23, firstName: "Yuki", lastName: "Tsunoda", team: "Red Bull Racing", teamColor: "#4781D7", img: getDriverImageUrl("Yuki", "Tsunoda"), position: 8, countryCode: "JP", countryCodeISO: "jp" },
    { number: 23, firstName: "Alexander", lastName: "Albon", team: "Williams", teamColor: "#1868DB", img: getDriverImageUrl("Alexander", "Albon"), position: 9, countryCode: "TH", countryCodeISO: "th" },
    { number: 55, firstName: "Carlos", lastName: "Sainz", team: "Williams", teamColor: "#1868DB", img: getDriverImageUrl("Carlos", "Sainz"), position: 10, countryCode: "ES", countryCodeISO: "es" },
    { number: 18, firstName: "Lance", lastName: "Stroll", team: "Aston Martin", teamColor: "#229971", img: getDriverImageUrl("Lance", "Stroll"), position: 11, countryCode: "CA", countryCodeISO: "ca" },
    { number: 14, firstName: "Fernando", lastName: "Alonso", team: "Aston Martin", teamColor: "#229971", img: getDriverImageUrl("Fernando", "Alonso"), position: 12, countryCode: "ES", countryCodeISO: "es" },
    { number: 18, firstName: "Liam", lastName: "Lawson", team: "Racing Bulls", teamColor: "#6C98FF", img: getDriverImageUrl("Liam", "Lawson"), position: 13, countryCode: "NZ", countryCodeISO: "nz" },
    { number: 19, firstName: "Isack", lastName: "Hadjar", team: "Racing Bulls", teamColor: "#6C98FF", img: getDriverImageUrl("Isack", "Hadjar"), position: 14, countryCode: "FR", countryCodeISO: "fr" },
    { number: 14, firstName: "Nico", lastName: "Hulkenberg", team: "Kick Sauber", teamColor: "#01C00E", img: getDriverImageUrl("Nico", "Hulkenberg"), position: 15, countryCode: "DE", countryCodeISO: "de" },
    { number: 12, firstName: "Gabriel", lastName: "Bortoleto", team: "Kick Sauber", teamColor: "#01C00E", img: getDriverImageUrl("Gabriel", "Bortoleto"), position: 16, countryCode: "BR", countryCodeISO: "br" },
    { number: 31, firstName: "Esteban", lastName: "Ocon", team: "Haas", teamColor: "#9C9FA2", img: getDriverImageUrl("Esteban", "Ocon"), position: 17, countryCode: "FR", countryCodeISO: "fr" },
    { number: 63, firstName: "Oliver", lastName: "Bearman", team: "Haas", teamColor: "#9C9FA2", img: getDriverImageUrl("Oliver", "Bearman"), position: 18, countryCode: "GB", countryCodeISO: "gb" },
    { number: 10, firstName: "Pierre", lastName: "Gasly", team: "Alpine", teamColor: "#00A1E8", img: getDriverImageUrl("Pierre", "Gasly"), position: 19, countryCode: "FR", countryCodeISO: "fr" },
    { number: 27, firstName: "Franco", lastName: "Colapinto", team: "Alpine", teamColor: "#00A1E8", img: "https://media.formula1.com/image/upload/f_auto,c_limit,q_75,w_auto/fom-website/2018-redesign-assets/drivers/2025/fracol01.png", position: 20, countryCode: "AR", countryCodeISO: "ar" },
];

