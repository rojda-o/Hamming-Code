document.getElementById('calculateBtn').addEventListener('click', calculateHammingCode);
document.getElementById('errorBtn').addEventListener('click', createError);

function calculateHammingCode()
{
    const inputData = document.getElementById('input_data').value;
    const dataLength = inputData.length;
            
    if (![4, 8, 16].includes(dataLength)) {
        alert('Please enter 4, 8, or 16 bits of data.');
        return;
    }

    let checkBitsCount = 0;
    while (Math.pow(2, checkBitsCount) < dataLength + checkBitsCount + 1) {
        checkBitsCount++;
}

    let totalBits = checkBitsCount + dataLength;
    
    let encodedData = new Array(totalBits).fill(0);
    let j = 0;

    //encodedData'yı dolduralım ve şimdilik control bitlerin yeri "0" olarak kalsın
    for (let i = 1; i <= totalBits; i++) {
        if (Math.log2(i) % 1 !== 0) {
            encodedData[i - 1] = parseInt(inputData[j]);
            j++;
        }
    }
    
    //control bitleri bulmak için değeri 1 olan bitlerin pozisyonlarını xor'layalım
    let checkBits = 0;
    for(let i=0; i<totalBits; i++){
        if(encodedData[i]===1){
            checkBits ^= i+1;
        }
    }
    checkBitsBinary = checkBits.toString(2).padStart(4, "0"); //4 bitlik(digit) bir binary olması için

    //ilk hamming kodu, daha sonra hata tespiti için kullanmak üzere html içerisine yazalım
    document.getElementById('hamming_code_1').innerText = `${checkBits}`; 
    document.getElementById('hamming_code_1').style.display = 'none';  // Bu satır eklenmeli

    let checkBits_in_data = []; //kontrol bitlerini, verileri okuduğumuz yöne göre yazmak için
    
    for(let i=checkBitsBinary.length-1; i>=0; i--){
        checkBits_in_data.push(checkBitsBinary[i]);
    }
    
    //verinin kontrol bitleri ile birlikte son hali
    let k=0;
    for (let i = 1; i <= totalBits; i++) {
        if (Math.log2(i) % 1 == 0) {
            encodedData[i - 1] = parseInt(checkBits_in_data[k]);
            k++;
        }
    }

    const encodedString = encodedData.join(''); //kullanıcıya göstermek için string haline getirip HTML içine gönderdik
    document.getElementById('result').innerText = `Encoded Data: ${encodedString}`;
}

function createError(){
    const error_position = document.getElementById('error_position').value;
    const encodedData = document.getElementById('result').innerText.split(': ')[1];

    if (error_position < 1 || error_position > encodedData.length) {
        alert('Invalid error position.');
        return;
    }

    
    //encodedData'yı integer bir diziye dönüştürmek için
    let myFunc = num => Number(num);
    let erroredData = Array.from(String(encodedData),myFunc);
    
    //error oluşturmak için
    if(erroredData[error_position-1] === 1){
        erroredData[error_position-1] = 0;
    }
    else if(erroredData[error_position-1] === 0){
        erroredData[error_position-1] = 1;
    }

    const erroredString = erroredData.join('');
    const detectedError = detectError(erroredData);

    document.getElementById('error_result').innerText = `Data with the error: ${erroredString}\nDetected Error Position: ${detectedError}th from left`;
}

function detectError(erroredData){
    //control bitleri bulmak için değeri 1 olan bitlerin pozisyonlarını xor'layalım
    //2'nin kuvveti olan basamakları kullamayalım(önceki kontrol bitleri)
    let checkBits_2 = 0;
    for(let i=0; i<erroredData.length; i++){
        if(erroredData[i]===1 && Math.log2(i+1) % 1 !== 0){
            checkBits_2 ^= i+1;
        }
    }

    const HammingCode_1 = document.getElementById('hamming_code_1').innerText;
    const HammingCode_2 = checkBits_2;

    let syndrom_word = HammingCode_1^HammingCode_2;
    console.log("sendrom: ", syndrom_word);

    return syndrom_word;
}
