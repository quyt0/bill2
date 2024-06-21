var loader = new PxLoader();
var logo_arr = [];

for (var i = 0; i < banks.length; i++) 
{
  logo_arr[i] = loader.addImage('./logos/' + banks[i].bin + '.png');
}

loader.start();


class Qr {
	static PREFIX = '000201010212';
	static SUFFIX = '6304';
	static PART_11_PREFIX = '0010A00000072701';
	static PART_2_PREFIX = '5303704';
	static AMOUNT_HEADER = '54';
	static PART_21_PREFIX = '5802VN62';
	static CHECK_SUM_LENGTH = 4;

	static decoder(input) {
		let parts = input.substring(
			Qr.PREFIX.length,
			input.length - Qr.SUFFIX.length - Qr.CHECK_SUM_LENGTH
		);
		parts = parts.substring(2);
		let part1Length = parseInt(parts.substring(0, 2));
		parts = parts.substring(2);
		let part1 = parts.substring(0, part1Length);

		part1 = part1.substring(Qr.PART_11_PREFIX.length);
		let part12Length = parseInt(part1.substring(0, 2));
		part1 = part1.substring(2);
		let part12 = part1.substring(0, part12Length);

		part12 = part12.substring(2);
		let bankIdLength = parseInt(part12.substring(0, 2));
		part12 = part12.substring(2);
		let bankId = part12.substring(0, bankIdLength);

		part12 = part12.substring(bankIdLength);
		part12 = part12.substring(2);
		let bankAccountLength = parseInt(part12.substring(0, 2));
		part12 = part12.substring(2);
		let bankAccount = part12.substring(0, bankAccountLength);

		let amount = 0;
		parts = parts.substring(part1Length);
		let part2 = parts.substring(Qr.PART_2_PREFIX.length);
		console.log(part2)
		if (part2.startsWith(Qr.AMOUNT_HEADER)) {
			part2 = part2.substring(2);
			let amountLength = parseInt(part2.substring(0, 2));
			part2 = part2.substring(2);
			amount = part2.substring(0, amountLength);
			part2 = part2.substring(amountLength);
		}

		let message = '';
		if (part2.length - Qr.PART_21_PREFIX.length > Qr.PART_21_PREFIX.length) {
			part2 = part2.substring(Qr.PART_21_PREFIX.length);
			let part21Length = parseInt(part2.substring(0, 2));
			part2 = part2.substring(2);
			let part21 = part2.substring(0, part21Length);
			part21 = part21.substring(2);
			let messageLength = parseInt(part21.substring(0, 2));
			part21 = part21.substring(2);
			message = part21.substring(0, messageLength);
		}


		return { bankId, bankAccount, amount, message };
	}
}

function onScanSuccess(decodedText) {
    var qr_text = String(decodedText);
    var qr_res = Qr.decoder(qr_text);
    document.getElementById('stk').value = qr_res.bankAccount;
    for (let i = 0; i < banks.length; i++)
    {
      if (banks[i].bin == qr_res.bankId)
      {
        document.getElementById('nh').value = banks[i].bin;
        document.getElementById('html5-qrcode-button-camera-stop').click();
        break;
      }
    }
  }
  
function onScanFailure(error) {
  console.warn(`Code scan error = ${error}`);
}
  
let html5QrcodeScanner = new Html5QrcodeScanner(
  "reader",
  { fps: 10, qrbox: {width: 250, height: 250} },
  /* verbose= */ false);
html5QrcodeScanner.render(onScanSuccess, onScanFailure);

function Create() {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var imageObj = new Image();
  imageObj.onload = function(){
      context.drawImage(imageObj, 0, 0);

      // So tien
      context.font = "81px averta_std_cysemibold";
      context.fillStyle = "#131fd3";
      context.textAlign = "center";
      var money = document.getElementById("st").value * 1000;
      context.fillText(money.toLocaleString().replaceAll(".", ",") + " VND", 540, 650.25);

      // Chu tai khoan
      context.font = "47px averta_std_cysemibold";
      context.fillStyle="#2e2e2e"
      context.textAlign = "center";
      var ctk = document.getElementById("ctk").value;
      context.fillText(ctk.toUpperCase(), 540, 954);

      // Ngan hang + STK
      context.font = "39px averta_std_cyregular";
      var stk = document.getElementById("stk").value;
      var nh = document.getElementById("nh").value;
      for (let i = 0; i < banks.length; i++)
      {
        if (banks[i].bin == nh)
        {
          nh = banks[i].shortName;
          break;
        }
      }
      nh += " - " + stk;
      context.fillStyle="#1d2b36";
      context.fillText(nh, 580, 1040);

      // Logo based on width of NH + STK
      var textWidth = context.measureText(nh).width;
      var imageX = 540 - textWidth / 2 - 54 - 2.5;
      var logonh = document.getElementById('nh').value;
      for (let i = 0; i < banks.length; i++)
        {
          if (banks[i].bin == logonh)
          {
            context.drawImage(logo_arr[i], imageX, 1000);
            break;
          }
        }

      // Ten nguoi chuyen khoan
      context.font = "39px averta_std_cyregular";
      var nameid = getRandomInt(0, 8754);
      var namestr = removeVietnameseTones(namedat[nameid].full_name).toString().toUpperCase();
      var name_custom = document.getElementById("nc").value;
      if (name_custom != '') namestr = name_custom.toUpperCase();
      namestr += " chuyen tien";
      context.fillText(namestr, 540, 1120);
  };
  imageObj.src = "template.jpg";
}

function removeVietnameseTones (str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
  str = str.replace(/Đ/g, 'D')
  return str
}

function DownloadCanvasAsImage(){
	let downloadLink = document.createElement('a');
	downloadLink.setAttribute('download', 'CanvasAsImage.png');
	let canvas = document.getElementById('canvas');
    let dataURL = canvas.toDataURL('image/png');
    let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
	downloadLink.setAttribute('href',url);
	downloadLink.click();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}