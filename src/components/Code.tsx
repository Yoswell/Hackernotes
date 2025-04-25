export function Code() {
return (
<>
<pre className='float-code float-code-1'> {`
    #include <stdio.h>
    #include <stdlib.h>
    #include <string.h>
    #include <openssl/sha.h>
    
    int decrypt_hash(const char* hash) {
        unsigned char buffer[SHA256_DIGEST_LENGTH];
        char attempt[256];
        int found = 0;
        
        printf("[+] Iniciando ataque a hash SHA-256...\n");
        printf("[+] Hash objetivo: %s\n", hash);
        
        for (int i = 0; i < 1000000; i++) {
            sprintf(attempt, "pass%d", i);
            SHA256(attempt, strlen(attempt), buffer);
            
            char hashed[SHA256_DIGEST_LENGTH*2+1];
            for (int j = 0; j < SHA256_DIGEST_LENGTH; j++) {
                sprintf(&hashed[j*2], "%02x", buffer[j]);
            }
            
            if (i % 10000 == 0) {
                printf("Probando combinación %d...\n", i);
            }
            
            if (strcmp(hashed, hash) == 0) {
                found = 1;
                printf("[+] ¡Contraseña encontrada!: %s\n", attempt);
                break;
            }
        }
        
        if (!found) {
            printf("[-] Ataque fallido. Hash no descifrado.\n");
        }
        
        return found;
    }
    
    int main() {
        const char* target_hash = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8";
        decrypt_hash(target_hash);
        return 0;
    }`}
</pre>
<pre className='float-code float-code-2'> {`
    const matrix = document.getElementById('matrix');
    const chars = "01";
    const fontSize = 14;
    const columns = Math.floor(window.innerWidth / fontSize);
    const rows = Math.floor(window.innerHeight / fontSize);
    
    matrix.style.fontSize = fontSize + 'px';
    
    for (let i = 0; i < columns; i++) {
        const column = document.createElement('div');
        column.style.position = 'absolute';
        column.style.top = -fontSize * rows + 'px';
        column.style.left = i * fontSize + 'px';
        column.style.whiteSpace = 'nowrap';
        matrix.appendChild(column);
        
        let text = '';
        for (let j = 0; j < rows; j++) {
            text += chars[Math.floor(Math.random() * chars.length)];
        }
        column.textContent = text;
        
        animateColumn(column, rows);
    }
    
    function animateColumn(column, rows) {
        let position = 0;
        const delay = Math.random() * 5000;
        
        setTimeout(() => {
            const interval = setInterval(() => {
                position++;
                column.style.top = (-fontSize * rows + position * fontSize) + 'px';
                
                if (position > rows * 2) {
                    clearInterval(interval);
                    column.style.top = -fontSize * rows + 'px';
                    animateColumn(column, rows);
                } else {
                    // Add new random character at the end
                    if (position % 2 === 0) {
                        column.textContent = column.textContent.substring(1) + chars[Math.floor(Math.random() * chars.length)];
                    }
                }
            }, 100);
        }, delay);
    }`}
</pre>
</>
)
}