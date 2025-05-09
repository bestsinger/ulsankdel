// 현재 날짜 표시
function displayCurrentDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('ko-KR', options);
}

// 급식 정보 가져오기
async function getMealInfo() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    try {
        const response = await fetch(
            `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=H10&SD_SCHUL_CODE=7491093&MLSV_YMD=${year}${month}${day}`
        );
        
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        
        // XML에서 급식 정보 추출
        const mealInfo = xmlDoc.getElementsByTagName("row");
        
        if (mealInfo.length > 0) {
            const menu = mealInfo[0].getElementsByTagName("DDISH_NM")[0].textContent;
            // 메뉴를 줄바꿈으로 구분하여 표시
            const formattedMenu = menu
                .replace(/<br\/>/g, '\n')
                .split('\n')
                .map(item => `<div class="menu-item">${item}</div>`)
                .join('');
            
            document.getElementById('lunch-menu').innerHTML = formattedMenu;
        } else {
            document.getElementById('lunch-menu').textContent = '급식 정보가 없습니다.';
        }
    } catch (error) {
        console.error('급식 정보를 가져오는데 실패했습니다:', error);
        document.getElementById('lunch-menu').textContent = '급식 정보를 불러오는데 실패했습니다.';
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    displayCurrentDate();
    getMealInfo();
});
