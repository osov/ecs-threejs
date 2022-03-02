export function getTime(minimum = false)
{
	var now = new Date();
	var dd:number|string = now.getDate();
	var mo:number|string = now.getMonth() + 1;
	var yy = now.getFullYear().toString();
	var hh:number|string = now.getHours();
	var mm:number|string = now.getMinutes();
	var ss:number|string = now.getSeconds();
	if (mo < 10)
		mo = '0'+mo;
	if (dd < 10)
		dd = '0'+dd;
	if (hh < 10)
		hh = '0'+hh;
	if (mm < 10)
		mm = '0'+mm;
	if (ss < 10)
		ss = '0'+ss;
	if (minimum)
		return mm + ':' + ss;
	return yy+"-"+mo+"-"+dd+" "+hh+":"+mm+":"+ss;
}

export function shuffleArray(array:any[])
{
	var currentIndex = array.length,  randomIndex;

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
	return array;
}

export function mtRand(min:number, max:number)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomSeed(s:number) {
    var mask = 0xffffffff;
    var m_w  = (123456789 + s) & mask;
    var m_z  = (987654321 - s) & mask;

    return function() {
      m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
      m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;

      var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
      result /= 4294967296;
      return result;
    }
}

export function mtRandSeed(min:number, max:number, seedFnc:() => number)
{
	var ra = seedFnc();
	return Math.floor(ra * (max - min + 1)) + min;
}
