var express = require('express'),
  http = require('http'),
  hdb = require('hdb');


try {
	var app = express();
	var server = http.createServer(app);
	server.listen(3000);
	var io = require('socket.io').listen(server);
	
	app.use(express.static(__dirname + '/'));
	
	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}
	
	var client = hdb.createClient({
	  host     : '107.22.192.171',
	  port     : 30015,
	  user     : 'system',
	  password : 'manager'
	});
	
	client.connect(function (err) {
		if (err) {
			console.error('Connect Error:', err);
		} else {
			console.log('Connected to server');
		}
	});
	
	process.on('uncaughtException', function (err) {
	  console.log('Caught exception: ' + err);
	});
	
	strContent = '';
	
	io.sockets.on('connection', function (socket) {
		socket.on('request', function (data) {
		// Handle Service Requests
		switch (data.service) {
			case 'CPU':
				client.exec("SELECT ABS(SUM(PROCESS_CPU)) as CPU from SYS.M_SERVICE_STATISTICS", function(err, rows) {
					if (err) {
						console.error('Error:', err);
					} else {
						socket.emit('response', {service: 'CPU', response: rows[0].CPU});
					}
				});
				break;
			case 'MEM':
				client.exec("select TO_VARCHAR(ROUND((FREE_PHYSICAL_MEMORY) /1024/1024/1024, 2)) AS FREEMEM from PUBLIC.M_HOST_RESOURCE_UTILIZATION", function(err, rows) {
					if (err) {
						console.error('Error:', err);
					} else {
						socket.emit('response', {service: data.service, response: rows[0].FREEMEM});
					}
				});
				break;
			case 'INFO':
				client.exec("SELECT VALUE FROM SYS.M_SYSTEM_OVERVIEW WHERE NAME = 'Version'", function(err, rows) {
					if (err) {
						console.error('Error:', err);
					} else {
						socket.emit('response', {service: data.service, response: rows[0].VALUE});
					}
				});
				break;
			case 'DISK':
				client.exec("select TO_VARCHAR((ROUND(d.total_size/1024/1024/1024, 2) - ROUND(d.used_size/1024/1024/1024,2))) as FREESPACE from ( ( m_volumes as v1 join M_VOLUME_SIZES as v2 on v1.volume_id = v2.volume_id )	right outer join m_disks as d on d.disk_id = v2.disk_id ) where d.usage_type = 'DATA' group by v1.host, d.usage_type, d.total_size,	d.device_id, d.path, d.used_size", function(err, rows) {
					if (err) {
						console.error('Error:', err);
					} else {
						socket.emit('response', {service: data.service, response: rows[0].FREESPACE});
					}
				});
				break;
			case 'USERS':
				client.exec("SELECT COUNT(CONNECTION_ID) as STATUS FROM SYS.M_CONNECTIONS WHERE CONNECTION_STATUS = 'RUNNING'", function(err, rows) {
					if (err) {
						console.error('Error:', err);
					} else {
						socket.emit('response', {service: data.service, response: rows[0].STATUS});
					}
				});
				break;
			case 'ALERTS':
				client.exec("SELECT COUNT(ALERT_DETAILS) as ALERTCOUNT FROM _SYS_STATISTICS.STATISTICS_CURRENT_ALERTS", function(err, rows) {
					if (err) {
						console.error('Error:', err);
					} else {
						socket.emit('response', {service: data.service, response: rows[0].ALERTCOUNT});
					}
				});
				break;
		}    
	  });
	});

} catch(err) {
	console.log(err);	
}