import dotenv from 'dotenv';
dotenv.config();

async function GetCoordsFromAddress(address){
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_API_KEY}`)
    const data = await response.json();
    if (data.results.length > 0){
        const coords = `{"lat": ${data.results[0].geometry.location.lat}, "lng": ${data.results[0].geometry.location.lng}}`;
        return coords;
    }
    else{
        return "No results found";
    }
}

export {GetCoordsFromAddress}

const sampleAddr = [
    "London",
    "1 Hacker Way,Menlo Park,CA"
]

for (const i of sampleAddr){
    const coords = await GetCoordsFromAddress(i);
    console.log(coords);
}
