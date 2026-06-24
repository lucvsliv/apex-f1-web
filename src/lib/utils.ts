import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDriverName(driverId: string, language: string = 'en') {
    if (!driverId) return "";

    if (language === 'ko') {
        const koMap: Record<string, string> = {
            "george-russell": "조지 러셀",
            "kimi-antonelli": "키미 안토넬리",
            "charles-leclerc": "샤를 르클레르",
            "lewis-hamilton": "루이스 해밀턴",
            "lando-norris": "랜도 노리스",
            "max-verstappen": "막스 베르스타펜",
            "oliver-bearman": "올리버 베어먼",
            "arvid-lindblad": "아비드 린드블라드",
            "gabriel-bortoleto": "가브리엘 보톨레토",
            "pierre-gasly": "피에르 가슬리",
            "esteban-ocon": "에스테반 오콘",
            "alexander-albon": "알렌산더 알본",
            "alex-albon": "알렌산더 알본",
            "liam-lawson": "리암 로슨",
            "franco-colapinto": "프랑코 콜라핀토",
            "carlos-sainz": "카를로스 사인스 주니어",
            "carlos-sainz-jr": "카를로스 사인스 주니어",
            "sergio-perez": "세르히오 페레스",
            "lance-stroll": "랜스 스트롤",
            "fernando-alonso": "페르난도 알론소",
            "valtteri-bottas": "발테리 보타스",
            "isack-hadjar": "아이작 하자르",
            "oscar-piastri": "오스카 피아스트리",
            "nico-hulkenberg": "니코 휠켄베르크",
            "yuki-tsunoda": "츠노다 유키",
            "guanyu-zhou": "저우 관유",
            "kevin-magnussen": "케빈 마그누센",
            "logan-sargeant": "로건 사전트",
            "daniel-ricciardo": "다니엘 리카르도",
            "jack-doohan": "잭 두한",
            "nyck-de-vries": "닉 더프리스",
            "sebastian-vettel": "세바스티안 베텔",
            "mick-schumacher": "믹 슈마허",
            "nicholas-latifi": "니콜라스 라티피",
            "kimi-raikkonen": "키미 라이코넨",
            "antonio-giovinazzi": "안토니오 지오비나치",
            "robert-kubica": "로버트 쿠비차",
            "nikita-mazepin": "니키타 마제핀",
            "daniil-kvyat": "다닐 크비얏",
            "romain-grosjean": "로맹 그로장",
            "jack-aitken": "잭 에이킨",
            "pietro-fittipaldi": "피에트로 피티팔디",
        };
        const lowerId = driverId.toLowerCase();
        if (koMap[lowerId]) return koMap[lowerId];
        // 맵에 없는 경우 driverId가 이름일 수 있음
        const nameKey = driverId.replace(/\s+/g, '-').toLowerCase();
        if (koMap[nameKey]) return koMap[nameKey];
    }

    return driverId
        .split(/[-\s]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function formatTeamName(teamId: string, language: string = 'en') {
    if (!teamId) return "";

    const cleanTeamId = teamId.toLowerCase().replace(/_/g, " ").replace(/-/g, " ");

    if (language === 'ko') {
        const koMap: Record<string, string> = {
            "mclaren": "맥라렌",
            "ferrari": "페라리",
            "red bull": "레드불 레이싱",
            "redbull": "레드불 레이싱",
            "mercedes": "메르세데스",
            "aston martin": "애스턴 마틴",
            "alpine": "알핀",
            "williams": "윌리엄스",
            "rb": "레이싱 불스",
            "racing bulls": "레이싱 불스",
            "haas": "하스",
            "audi": "아우디",
            "sauber": "자우버",
            "kick sauber": "킥 자우버",
            "cadillac": "캐딜락",
            "toro rosso": "토로 로소",
            "force india": "포스 인디아",
            "renault": "르노",
            "alfa romeo": "알파 로메오",
            "racing point": "레이싱 포인트",
            "alphatauri": "알파타우리"
        };

        if (koMap[cleanTeamId]) return koMap[cleanTeamId];

        for (const [eng, kor] of Object.entries(koMap)) {
            if (new RegExp(eng, 'i').test(cleanTeamId)) {
                return kor;
            }
        }
    }

    // Default to capitalized English words if no match or not Korean
    return cleanTeamId
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function translateCountry(country: string, language: string = 'en') {
    if (!country) return "";
    if (language !== 'ko') return country;

    const map: Record<string, string> = {
        "Australia": "호주", "Bahrain": "바레인", "Saudi Arabia": "사우디아라비아",
        "Japan": "일본", "China": "중국", "USA": "미국", "United States": "미국", "United States of America": "미국",
        "Italy": "이탈리아", "Monaco": "모나코", "Canada": "캐나다",
        "Spain": "스페인", "Austria": "오스트리아", "Great Britain": "영국", "UK": "영국", "United Kingdom": "영국",
        "Hungary": "헝가리", "Belgium": "벨기에", "Netherlands": "네덜란드",
        "Singapore": "싱가포르", "Azerbaijan": "아제르바이잔", "Mexico": "멕시코",
        "Brazil": "브라질", "Qatar": "카타르", "UAE": "아랍에미리트", "United Arab Emirates": "아랍에미리트",
        "Portugal": "포르투갈", "France": "프랑스", "Germany": "독일", "Russia": "러시아", "Turkey": "터키",
        "Malaysia": "말레이시아", "South Korea": "대한민국", "India": "인도"
    };

    return map[country] || country;
} 1

export function formatGpName(name: string, language: string = 'en') {
    if (!name) return "";
    if (language !== 'ko') return name;

    const countryMap: Record<string, string> = {
        "Australian": "호주", "Bahrain": "바레인", "Saudi Arabian": "사우디아라비아",
        "Japanese": "일본", "Chinese": "중국", "Miami": "마이애미",
        "Emilia Romagna": "에밀리아 로마냐", "Emilia-Romagna": "에밀리아-로마냐",
        "Monaco": "모나코", "Canadian": "캐나다", "du Canada": "캐나다", "Canada": "캐나다",
        "Spanish": "스페인", "España": "스페인", "Barcelona-Catalunya": "바르셀로나-카탈루냐",
        "Austrian": "오스트리아", "British": "영국", "Hungarian": "헝가리",
        "Belgian": "벨기에", "Dutch": "네덜란드", "Italian": "이탈리아", "Italia": "이탈리아",
        "Azerbaijan": "아제르바이잔", "Singapore": "싱가포르",
        "United States": "미국", "Mexico City": "멕시코 시티", "México": "멕시코 시티", "Mexico": "멕시코 시티",
        "São Paulo": "상파울루", "Sao Paulo": "상파울루",
        "Las Vegas": "라스베이거스", "Qatar": "카타르", "Abu Dhabi": "아부다비",
    };

    for (const [eng, kor] of Object.entries(countryMap)) {
        if (new RegExp(eng, 'i').test(name)) {
            return `${kor} 그랑프리`;
        }
    }

    return name.replace(/Formula 1\s*/i, "").replace(/\s*\d{4}$/, "").replace(/Grand Prix/i, "그랑프리").trim();
}
export function formatGrandPrixId(grandPrixId: string, language: string = 'en', includeSuffix: boolean = true) {
    if (!grandPrixId) return "";

    const map: Record<string, { en: string, ko: string }> = {
        "australia": { en: "Australia", ko: "호주" },
        "bahrain": { en: "Bahrain", ko: "바레인" },
        "saudi_arabia": { en: "Saudi Arabia", ko: "사우디아라비아" },
        "saudi-arabia": { en: "Saudi Arabia", ko: "사우디아라비아" },
        "japan": { en: "Japan", ko: "일본" },
        "china": { en: "China", ko: "중국" },
        "miami": { en: "Miami", ko: "마이애미" },
        "emilia_romagna": { en: "Emilia-Romagna", ko: "에밀리아-로마냐" },
        "emilia-romagna": { en: "Emilia-Romagna", ko: "에밀리아-로마냐" },
        "monaco": { en: "Monaco", ko: "모나코" },
        "canada": { en: "Canada", ko: "캐나다" },
        "spain": { en: "Spain", ko: "스페인" },
        "austria": { en: "Austria", ko: "오스트리아" },
        "great_britain": { en: "Great Britain", ko: "영국" },
        "great-britain": { en: "Great Britain", ko: "영국" },
        "hungary": { en: "Hungary", ko: "헝가리" },
        "belgium": { en: "Belgium", ko: "벨기에" },
        "netherlands": { en: "Netherlands", ko: "네덜란드" },
        "italy": { en: "Italy", ko: "이탈리아" },
        "azerbaijan": { en: "Azerbaijan", ko: "아제르바이잔" },
        "singapore": { en: "Singapore", ko: "싱가포르" },
        "usa": { en: "United States", ko: "미국" },
        "united_states": { en: "United States", ko: "미국" },
        "united-states": { en: "United States", ko: "미국" },
        "mexico": { en: "Mexico", ko: "멕시코" },
        "sao_paulo": { en: "São Paulo", ko: "상파울루" },
        "sao-paulo": { en: "São Paulo", ko: "상파울루" },
        "brazil": { en: "São Paulo", ko: "상파울루" },
        "las_vegas": { en: "Las Vegas", ko: "라스베이거스" },
        "las-vegas": { en: "Las Vegas", ko: "라스베이거스" },
        "qatar": { en: "Qatar", ko: "카타르" },
        "abu_dhabi": { en: "Abu Dhabi", ko: "아부다비" },
        "abu-dhabi": { en: "Abu Dhabi", ko: "아부다비" },
        "barcelona_catalunya": { en: "Barcelona-Catalunya", ko: "바르셀로나-카탈루냐" },
        "barcelona-catalunya": { en: "Barcelona-Catalunya", ko: "바르셀로나-카탈루냐" },
    };

    const lowerId = grandPrixId.toLowerCase();
    const mapped = map[lowerId];

    if (mapped) {
        if (!includeSuffix) return language === 'ko' ? mapped.ko : mapped.en;
        return language === 'ko' ? `${mapped.ko} 그랑프리` : `${mapped.en} Grand Prix`;
    }

    // Fallback: capitalize words and replace dashes/underscores with spaces
    const fallbackEn = grandPrixId.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    if (!includeSuffix) return fallbackEn;
    return language === 'ko' ? `${fallbackEn} 그랑프리` : `${fallbackEn} Grand Prix`;
}


export function translateCircuitName(circuitFullName: string, language: string = 'en') {
    if (!circuitFullName) return "";
    if (language !== 'ko') return circuitFullName;

    const map: Record<string, string> = {
        "Bahrain International Circuit": "바레인 인터내셔널 서킷",
        "Jeddah Corniche Circuit": "제다 코니쉬 서킷",
        "Albert Park Circuit": "알버트 파크 서킷",
        "Melbourne Grand Prix Circuit": "멜버른 그랑프리 서킷",
        "Suzuka Circuit": "스즈카 서킷",
        "Suzuka International Racing Course": "스즈카 서킷",
        "Shanghai International Circuit": "상하이 인터내셔널 서킷",
        "Miami International Autodrome": "마이애미 인터내셔널 오토드롬",
        "Autodromo Internazionale Enzo e Dino Ferrari": "아우토드로모 인테르나치오날레 엔초 에 디노 페라리",
        "Circuit de Monaco": "모나코 서킷",
        "Circuit Gilles Villeneuve": "질 빌뇌브 서킷",
        "Circuit de Barcelona-Catalunya": "바르셀로나-카탈루냐 서킷",
        "Circuito de Madring": "마드링 서킷",
        "Red Bull Ring": "레드불 링",
        "Silverstone Circuit": "실버스톤 서킷",
        "Hungaroring": "헝가로링",
        "Circuit de Spa-Francorchamps": "스파-프랑코샹 서킷",
        "Circuit Park Zandvoort": "잔드보르트 서킷",
        "Autodromo Nazionale Monza": "오토드로모 나치오날레 몬차",
        "Baku City Circuit": "바쿠 시티 서킷",
        "Marina Bay Street Circuit": "마리나 베이 스트리트 서킷",
        "Circuit of the Americas": "서킷 오브 디 아메리카스",
        "Autódromo Hermanos Rodríguez": "에르마노스 로드리게스 오토드로모",
        "Autódromo José Carlos Pace": "조제 카를로스 파체 오토드로모",
        "Las Vegas Street Circuit": "라스베이거스 스트리트 서킷",
        "Lusail International Circuit": "루사일 인터내셔널 서킷",
        "Yas Marina Circuit": "야스 마리나 서킷",
        "Circuit Paul Ricard": "폴 리카르 서킷",
        "Algarve International Circuit": "알가르브 인터내셔널 서킷",
        "Sochi Autodrom": "소치 오토드롬",
        "Istanbul Park": "이스탄불 파크",
        "Nürburgring": "뉘르부르크링",
        "Autodromo Internazionale del Mugello": "아우토드로모 인테르나치오날레 델 무젤로",
        "Hockenheimring": "호켄하임링",
        "Sepang International Circuit": "세팡 인터내셔널 서킷",
        "Korea International Circuit": "코리아 인터내셔널 서킷",
        "Buddh International Circuit": "부드 인터내셔널 서킷",
        "Valencia Street Circuit": "발렌시아 스트리트 서킷",
        "Circuit de Nevers Magny-Cours": "느베르 마그니쿠르 서킷",
        "Fuji Speedway": "후지 스피드웨이",
        "Indianapolis Motor Speedway": "인디애나폴리스 모터 스피드웨이"
    };

    return map[circuitFullName] || circuitFullName;
}

export function translateCity(city: string, language: string = 'en') {
    if (!city) return "";
    if (language !== 'ko') return city;

    const map: Record<string, string> = {
        "Sakhir": "사키르", "Jeddah": "제다", "Melbourne": "멜버른", "Suzuka": "스즈카",
        "Shanghai": "상하이", "Miami": "마이애미", "Imola": "이몰라", "Monte Carlo": "몬테카를로",
        "Montreal": "몬트리올", "Barcelona": "바르셀로나", "Spielberg": "스피엘베르크",
        "Silverstone": "실버스톤", "Budapest": "부다페스트", "Spa-Francorchamps": "스파-프랑코샹",
        "Zandvoort": "잔드보르트", "Monza": "몬차", "Baku": "바쿠", "Marina Bay": "마리나 베이",
        "Austin": "오스틴", "Mexico City": "멕시코 시티", "Sao Paulo": "상파울루", "São Paulo": "상파울루",
        "Las Vegas": "라스베이거스", "Lusail": "루사일", "Abu Dhabi": "아부다비", "Kuala Lumpur": "쿠알라룸푸르",
        "Istanbul": "이스탄불", "Hockenheim": "호켄하임", "Nurburg": "뉘르부르크", "Yeongam": "영암",
        "New Delhi": "뉴델리", "Valencia": "발렌시아", "Magny-Cours": "마니쿠르", "Singapore": "싱가포르",
        "Miami Gardens": "마이애미 가든스", "Madrid": "마드리드", "Montmeló": "몬트멜로", "Spa": "스파",
        "Le Castellet": "르 카스텔레", "Sochi": "소치", "Nürburg": "뉘르부르크",
        "Scarperia e San Piero": "스카르페리아 에 산 피에로", "Mugello": "무젤로", "Turin": "토리노", "Portimão": "포르티망",
        "Sepang": "세팡", "Greater Noida": "그레이터 노이다", "Nevers": "느베르", "Oyama": "오야마",
        "Indianapolis": "인디애나폴리스",
    };

    return map[city] || city;
}
