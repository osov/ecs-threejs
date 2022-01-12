import {EventDispatcher} from 'three';
import {getTime} from '../core/utils';
import * as fs from 'fs';

export class BaseSystem extends EventDispatcher{

	protected add_log_par = '';
	protected log_level = 'console';

	constructor()
	{
		super();
	}

	getLogName(type:string, ex = '', date = '')
	{
		if (date != '')
			var name = date+'_';
		else
			var name = getTime().split(" ")[0]+'_';
		if (ex != '')
			name = name + '['+ex+']_';
		name = name + type+'.txt';
		return name;
	}

	private _log(type = 'log', args:any)
	{
		//this.emit('log-'+type, this, args);
		const is_server = !(typeof window != 'undefined' && window.document);
		if (is_server)
		{
			const date = getTime();
			args = [].slice.call(args);
			if (this.add_log_par != '')
				args.unshift(date + ' [' + this.add_log_par + ']: ');
			else
				args.unshift(date + ':');
		}
		if (this.log_level == 'all' || this.log_level == 'console')
		{
			if (is_server)
			{
				var largs = args.slice(0);
				if (type == 'log')
				{
					largs.unshift('\x1b[0m');
					largs.push('\x1b[0m');
				}
				if (type == 'info')
				{
					largs.unshift('\x1b[32m');
					largs.push('\x1b[0m');
				}
				if (type == 'warn')
				{
					largs.unshift('\x1b[33m');
					largs.push('\x1b[0m');
				}
				if (type == 'error')
				{
					largs.unshift('\x1b[31m');
					largs.push('\x1b[0m');
				}
			}
			else
				var largs = args; // [].slice.call(args);

			if (type == 'log')
				console.log.apply(console, largs);
			if (type == 'info')
				console.info.apply(console, largs);
			else if (type == 'warn')
				console.warn.apply(console, largs);
			else if (type == 'error')
				console.error.apply(console, largs);
		}
		if (is_server && (this.log_level == 'all' || this.log_level == 'file' || type == 'error'))
		{
			var s = '';
			for (var i = 0; i < args.length; i++)
				s += (typeof args[i] === 'object' ? JSON.stringify(args[i]) : args[i]) + ' ';
			var message = s.split("\n").join('-rn-') + "\r\n";
			if (!fs.existsSync('./logs/'))
				 fs.mkdirSync('./logs/');
			fs.appendFileSync('./logs/'+this.getLogName(type, this.add_log_par), message, 'utf-8');
			fs.appendFileSync('./logs/'+this.getLogName('all', this.add_log_par), type+'-'+message, 'utf-8');
		}
	}

	log(...args:any)
	{
		this._log('log', arguments);
	}

	info(...args:any)
	{
		this._log('info', arguments);
	}

	error(...args:any)
	{
		this._log('error', arguments);
	}

	warn(...args:any)
	{
		this._log('warn', arguments);
	}

}