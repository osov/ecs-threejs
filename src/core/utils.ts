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