
const fetch = require('node-fetch');

async function testSSE() {
    const response = await fetch('http://localhost:8080/api/v1/agent/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 여기에 토큰이 필요할 수 있지만, 일단 형식을 보기 위함
        },
        body: JSON.stringify({
            message: '막스 베르스타펜의 시즌 기록을 표로 보여줘',
            chatId: 'test-chat'
        })
    });

    const reader = response.body;
    reader.on('data', chunk => {
        console.log('--- CHUNK START ---');
        console.log(chunk.toString());
        console.log('--- CHUNK END ---');
    });
}

// testSSE();
