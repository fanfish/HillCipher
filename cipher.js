/*
Written in August 2023 by wenjun
Tested in Chrome and Edge browsers.
*/
const modular = 65521;
const block_size = 3;
const space = 32;
var public_key_data = new Array();
var private_key_data = new Array();
var plainText_array = new Array();
var cipherText_array = new Array();

class Matrix {
    constructor(data) {
        //2d array
        this.data = data;
        this.row = data.length;
        this.column = data[0].length;
    }

    mmulVector(vec) {
        if (vec.length != this.column) {
            console.log("the column of matrix must be equal with the row of vector!");
            return;
        }
        let result_matrix_data = new Array(this.row);
        for (let i = 0; i < this.data.length; i++) {
            let row = this.data[i];
            let sum_i = 0;
            for (let j = 0; j < row.length; j++) {
                sum_i += (vec[j] * row[j]) % modular;
            }
            result_matrix_data[i] = sum_i % modular;
        }
        return result_matrix_data;
    }
}

function initPublicKey(key) {
    let pub_key_codes = new Array();
    let key_len = charsLength(key, pub_key_codes);
    if (key_len != block_size * block_size) {
        alert("Failed to initialize the public key! " + key);
        return;
    }
    for (let i = 0; i < block_size; i++) {
        let start = i * block_size;
        let end = start + block_size;
        let vector = pub_key_codes.slice(start, end);
        public_key_data.push(vector);
    }      
}

function clear(array){
    array.length=0;
}

function initPrivateKey(key) {
    let pri_key_codes = new Array();
    let key_len = charsLength(key, pri_key_codes);
    if (key_len != block_size * block_size) {
        alert("Failed to initialize the private key! " + key);
        return;
    }
    for (let i = 0; i < block_size; i++) {
        let start = i * block_size;
        let end = start + block_size;
        let vector = pri_key_codes.slice(start, end);
        private_key_data.push(vector);
    }      
}

function encryption(plainText) {    
    clear(plainText_array);
    let text_length = charsLength(plainText, plainText_array);
    let padding_number = block_size - (text_length % block_size);
    if (padding_number != 0) {
        for (let k = 0; k < padding_number; k++) {
            plainText_array.push(space);
        }
    }
    let cipher_chars = new Array();
    let encryption_matrix = new Matrix(public_key_data);
    let block_number = plainText_array.length / block_size;
    for (let i = 0; i < block_number; i++) {
        let start = i * block_size;
        let end = start + block_size;
        let vector = plainText_array.slice(start, end);
        let cipher_vector = encryption_matrix.mmulVector(vector);
        for (let m = 0; m < cipher_vector.length; m++) {
            cipher_chars.push(cipher_vector[m]);
        }
    }
    return toText(cipher_chars);
}

function toText(chars) {
    //let text=String.fromCharCode(...chars);
    let text = String.fromCodePoint(...chars);
    return text;
}

function decryption(cipherText) {    
    clear(cipherText_array);   
    let text_length = charsLength(cipherText, cipherText_array);
    let padding_number = block_size - (text_length % block_size);
    if (padding_number != 0) {
        for (let k = 0; k < padding_number; k++) {
            plainText_array.push(space);
        }
    }
    let plain_chars = new Array();
    let decryption_matrix = new Matrix(private_key_data);
    let block_number = cipherText_array.length / block_size;
    for (let i = 0; i < block_number; i++) {
        let start = i * block_size;
        let end = start + block_size;
        let vector = cipherText_array.slice(start, end);
        let plain_vector = decryption_matrix.mmulVector(vector);
        for (let m = 0; m < plain_vector.length; m++) {
            plain_chars.push(plain_vector[m]);
        }
    }
    return toText(plain_chars);
}

function charsLength(text, codes_array) {
    let length = 0;    
    for (let char of text) {
        if (char.codePointAt(0) < modular) {
            length++;
            codes_array.push(char.codePointAt(0));
        } else {
            //console.log(char, " is out of \uFFF0");
            alert(char + " is out of \uFFF0");
            return;
        }
    }
    return length;
}
