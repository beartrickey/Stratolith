#pragma strict

public static var droneBlueprintSpriteId = new Array( 82, 85, 84, -1, 86, 83, -1 );

public static var droneJson = [

	// 1 Wave Type
	// 4 Power
	{
		"modelNumber": "0202",
		"totalPower": 4,
		"waveTypes": 1,
		"hackable": false,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_PASS_CLOSE_UP,
			GameManager.DRONE_PATH_PASS_MEDIUM_UP,
			GameManager.DRONE_PATH_PASS_CLOSE_DOWN,
			GameManager.DRONE_PATH_PASS_MEDIUM_DOWN
		]
	},

	// 6 Power
	{
		"modelNumber": "0204",
		"totalPower": 6,
		"waveTypes": 1,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_PASS_CLOSE_UP,
			GameManager.DRONE_PATH_PASS_MEDIUM_UP,
			GameManager.DRONE_PATH_PASS_CLOSE_DOWN,
			GameManager.DRONE_PATH_PASS_MEDIUM_DOWN,
			GameManager.DRONE_PATH_TOKKOU
		]
	},

	// 8 Power
	{
		"modelNumber": "2222",
		"totalPower": 8,
		"waveTypes": 1,
		"hackable": false,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},
	{
		"modelNumber": "0602",
		"totalPower": 8,
		"waveTypes": 1,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_PASS_CLOSE_UP,
			GameManager.DRONE_PATH_PASS_MEDIUM_UP,
			GameManager.DRONE_PATH_PASS_CLOSE_DOWN,
			GameManager.DRONE_PATH_PASS_MEDIUM_DOWN,
			GameManager.DRONE_PATH_TOKKOU
		]
	},
	{
		"modelNumber": "0206",
		"totalPower": 8,
		"waveTypes": 1,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_PASS_CLOSE_UP,
			GameManager.DRONE_PATH_PASS_MEDIUM_UP,
			GameManager.DRONE_PATH_PASS_CLOSE_DOWN,
			GameManager.DRONE_PATH_PASS_MEDIUM_DOWN,
			GameManager.DRONE_PATH_TOKKOU
		]
	},
	{
		"modelNumber": "0404",
		"totalPower": 8,
		"waveTypes": 1,
		"hackable": false,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_PASS_CLOSE_UP,
			GameManager.DRONE_PATH_PASS_MEDIUM_UP,
			GameManager.DRONE_PATH_PASS_CLOSE_DOWN,
			GameManager.DRONE_PATH_PASS_MEDIUM_DOWN,
			GameManager.DRONE_PATH_TOKKOU
		]
	},

	// 2 Wave Types
	// 10 Power
	{
		"modelNumber": "4222",
		"totalPower": 10,
		"waveTypes": 2,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},
	{
		"modelNumber": "2422",
		"totalPower": 10,
		"waveTypes": 2,
		"hackable": false,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},
	{
		"modelNumber": "2242",
		"totalPower": 10,
		"waveTypes": 2,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},
	{
		"modelNumber": "2224",
		"totalPower": 10,
		"waveTypes": 2,
		"hackable": false,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},
	{
		"modelNumber": "0208",
		"totalPower": 10,
		"waveTypes": 2,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_PASS_CLOSE_UP,
			GameManager.DRONE_PATH_PASS_MEDIUM_UP,
			GameManager.DRONE_PATH_PASS_CLOSE_DOWN,
			GameManager.DRONE_PATH_PASS_MEDIUM_DOWN,
			GameManager.DRONE_PATH_TOKKOU
		]
	},
	{
		"modelNumber": "0802",
		"totalPower": 10,
		"waveTypes": 2,
		"hackable": false,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_PASS_CLOSE_UP,
			GameManager.DRONE_PATH_PASS_MEDIUM_UP,
			GameManager.DRONE_PATH_PASS_CLOSE_DOWN,
			GameManager.DRONE_PATH_PASS_MEDIUM_DOWN,
			GameManager.DRONE_PATH_TOKKOU
		]
	},

	// 12 Power
	{
		"modelNumber": "6222",
		"totalPower": 12,
		"waveTypes": 2,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},
	{
		"modelNumber": "2622",
		"totalPower": 12,
		"waveTypes": 2,
		"hackable": false,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},
	{
		"modelNumber": "2262",
		"totalPower": 12,
		"waveTypes": 2,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},
	{
		"modelNumber": "2226",
		"totalPower": 12,
		"waveTypes": 2,
		"hackable": false,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},
	{
		"modelNumber": "0408",
		"totalPower": 12,
		"waveTypes": 2,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_PASS_CLOSE_UP,
			GameManager.DRONE_PATH_PASS_MEDIUM_UP,
			GameManager.DRONE_PATH_PASS_CLOSE_DOWN,
			GameManager.DRONE_PATH_PASS_MEDIUM_DOWN,
			GameManager.DRONE_PATH_TOKKOU
		]
	},
	{
		"modelNumber": "0804",
		"totalPower": 12,
		"waveTypes": 2,
		"hackable": false,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_PASS_CLOSE_UP,
			GameManager.DRONE_PATH_PASS_MEDIUM_UP,
			GameManager.DRONE_PATH_PASS_CLOSE_DOWN,
			GameManager.DRONE_PATH_PASS_MEDIUM_DOWN,
			GameManager.DRONE_PATH_TOKKOU
		]
	},
	{
		"modelNumber": "0606",
		"totalPower": 12,
		"waveTypes": 2,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_PASS_CLOSE_UP,
			GameManager.DRONE_PATH_PASS_MEDIUM_UP,
			GameManager.DRONE_PATH_PASS_CLOSE_DOWN,
			GameManager.DRONE_PATH_PASS_MEDIUM_DOWN,
			GameManager.DRONE_PATH_TOKKOU
		]
	},

	// 14 Power
	{
		"modelNumber": "8222",
		"totalPower": 14,
		"waveTypes": 2,
		"hackable": false,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},
	{
		"modelNumber": "2822",
		"totalPower": 14,
		"waveTypes": 2,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},
	{
		"modelNumber": "2282",
		"totalPower": 14,
		"waveTypes": 2,
		"hackable": false,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE,
			GameManager.DRONE_PATH_FAR_STRIKE
		]
	},
	{
		"modelNumber": "2228",
		"totalPower": 14,
		"waveTypes": 2,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},
	{
		"modelNumber": "0608",
		"totalPower": 14,
		"waveTypes": 2,
		"hackable": false,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_PASS_CLOSE_UP,
			GameManager.DRONE_PATH_PASS_MEDIUM_UP,
			GameManager.DRONE_PATH_PASS_CLOSE_DOWN,
			GameManager.DRONE_PATH_PASS_MEDIUM_DOWN,
			GameManager.DRONE_PATH_TOKKOU
		]
	},
	{
		"modelNumber": "0806",
		"totalPower": 14,
		"waveTypes": 2,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_PASS_CLOSE_UP,
			GameManager.DRONE_PATH_PASS_MEDIUM_UP,
			GameManager.DRONE_PATH_PASS_CLOSE_DOWN,
			GameManager.DRONE_PATH_PASS_MEDIUM_DOWN,
			GameManager.DRONE_PATH_TOKKOU
		]
	},

	// 3 Wave Types
	// 16 Power
	{
		"modelNumber": "4444",
		"totalPower": 16,
		"waveTypes": 3,
		"hackable": false,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},
	{
		"modelNumber": "0808",
		"totalPower": 16,
		"waveTypes": 3,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_PASS_CLOSE_UP,
			GameManager.DRONE_PATH_PASS_MEDIUM_UP,
			GameManager.DRONE_PATH_PASS_CLOSE_DOWN,
			GameManager.DRONE_PATH_PASS_MEDIUM_DOWN,
			GameManager.DRONE_PATH_TOKKOU
		]
	},

	// 20 Power
	{
		"modelNumber": "8444",
		"totalPower": 20,
		"waveTypes": 3,
		"hackable": false,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},
	{
		"modelNumber": "4844",
		"totalPower": 20,
		"waveTypes": 3,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},
	{
		"modelNumber": "4484",
		"totalPower": 20,
		"waveTypes": 3,
		"hackable": false,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE,
			GameManager.DRONE_PATH_FAR_STRIKE
		]
	},
	{
		"modelNumber": "4448",
		"totalPower": 20,
		"waveTypes": 3,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},

	// 24 Power
	{
		"modelNumber": "6666",
		"totalPower": 24,
		"waveTypes": 3,
		"hackable": false,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},

	// 26 Power
	{
		"modelNumber": "8666",
		"totalPower": 26,
		"waveTypes": 4,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},
	{
		"modelNumber": "6866",
		"totalPower": 26,
		"waveTypes": 4,
		"hackable": false,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},
	{
		"modelNumber": "6686",
		"totalPower": 26,
		"waveTypes": 4,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE,
			GameManager.DRONE_PATH_FAR_STRIKE
		]
	},
	{
		"modelNumber": "6668",
		"totalPower": 26,
		"waveTypes": 4,
		"hackable": false,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE
		]
	},

	// 32 Power
	{
		"modelNumber": "8888",
		"totalPower": 32,
		"waveTypes": 4,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE,
			GameManager.DRONE_PATH_FAR_STRIKE
		]
	},

	// 36 Power
	{
		"modelNumber": "9999",
		"totalPower": 36,
		"waveTypes": 4,
		"hackable": true,
		"reload": 200,
		"texture": "Drone-1111",
		"dronePaths": [
			GameManager.DRONE_PATH_CLOSE_STRIKE,
			GameManager.DRONE_PATH_MEDIUM_STRIKE,
			GameManager.DRONE_PATH_FAR_STRIKE
		]
	}

];

static function getDroneWithAttributes( _totalPower : int, _hackable : int ) : System.Collections.Hashtable
{
	// _totalPower : int, sum of all digits in modelNumber
	// _hackable : int, -1 any, 0 false, 1 true 

	var tempDronePool = new Array();

	// Gather initial drones and add to pool
	for( var d : int = 0; d < droneJson.length; d++ )
	{

		// Power Level
		if( droneJson[d]["totalPower"] != _totalPower )
		{
			continue;
		}

		// Hackability
		if( _hackable == 0 &&  droneJson[d]["hackable"] == true )
			continue;
		if( _hackable == 1 &&  droneJson[d]["hackable"] == false )
			continue;

		// Add to pool
		tempDronePool.Push( droneJson[d] );

	}

	// Choose one randomly from the pool
	var randomIndex : int = Random.Range( 0, tempDronePool.length );
	return tempDronePool[randomIndex];

}


static function getDroneWithModelNumber( _modelString : String ) : System.Collections.Hashtable
{

	// Gather initial drones and add to pool
	for( var d : int = 0; d < droneJson.length; d++ )
	{

		if( droneJson[d]["modelNumber"] == _modelString )
		{
			return droneJson[d];
		}

	}

}


public var isActive : boolean = false;

public var scopeList = new Scope[3];

public var counter : int = 0;

public var droneType : int = 0;

public var maxHealth : float = 0.0;
public var health : float = 0.0;

// List of flags for each scopes hack state
public var hackedScopeList = new boolean[3];
public var nullifiable : boolean = false;
public var waveTypes : int = 0;


//movement
public var position : Vector2; // The absolute position of drone icon

public var direction : float;

public var speed : float = 0.0;

public var startSpeed : float = 0.1;

public var maxSpeed : float = 0.3;

public var accelRate : float = 1.04;

public var decelRate : float = 0.998;


//paths
public var destination : Vector2 = Vector2( 0.0, 0.0 );


//power diversion
public var damageIndex : int = 0;
public var velocityIndex : int = 0;
public var shieldIndex : int = 0;
public var rangeIndex : int = 0;

public static var DRONE_POWER_NONE : int = -1;
public static var DRONE_POWER_WEAP : int = 0;
public static var DRONE_POWER_VELO : int = 1;
public static var DRONE_POWER_RNGE : int = 2;
public static var DRONE_POWER_SHLD : int = 3;
public var dronePowerState : int = DRONE_POWER_NONE;


// Surge
public static var SURGE_STATE_READY : int = 0;
public static var SURGE_STATE_ON : int = 1;
public static var SURGE_STATE_RECHARGING : int = 2;
public var surgeState : int = SURGE_STATE_READY;

public static var surgeUseRate : float = 1.0 / (60.0 * 10.0); // 600 frames (10 seconds)
public static var surgeRechargeRate : float = 1.0 / (60.0 * 20.0); // 600 frames (20 seconds)
public var surgeAmount : float = 1.0;


//combat vars
public var attackTarget : GameObject = null;
public var attackRange : float = 200.0;
public var reloadCounterMax : int = 180;
public var reloadCounter : int = 0;


public var slgd : SublayerGameDelegate;

public var bulletDamage : float = 0.0;


////graphics
public var boxCollider : BoxCollider;

public var destinationIcon : tk2dSprite;

public var targetIcon : tk2dSprite;

public var targetLine : DottedLineRenderer;

public var icon : tk2dSprite;

public var circleRenderer : CircleRenderer;


//damage
public var jitterCounter : int = 0;


//label
public var droneInfoLabel : tk2dTextMesh;

public var modelString : String;


//drone docking
public var droneDockingCounter : int = 0;


// Item collection
public var targetItem : ItemLocator = null;
public var hasItem : boolean = false;
public var itemGraphic : tk2dSprite = null;


////STATES
public static var DRONE_STATE_IDLE : int = 0;
public static var DRONE_STATE_MOVE : int = 1;
public static var DRONE_STATE_ATTK : int = 2;
public static var DRONE_STATE_DOCK : int = 3;
public static var DRONE_STATE_SLVG : int = 4;
public static var DRONE_STATE_PREPARING_TO_DOCK : int = 5;
public static var DRONE_STATE_DOCKED : int = 6;
public static var DRONE_STATE_PREPARING_TO_LAUNCH : int = 7;
public static var DRONE_STATE_DYING : int = 8;
public static var DRONE_STATE_CHARGED_TO_DEATH : int = 9;
public static var DRONE_STATE_ATTACK_STRATOLITH : int = 10;
public static var DRONE_STATE_PRESET_IDLE : int = 11;

public var state : int = DRONE_STATE_IDLE;

public var insideCloud : boolean = false;



function onInstantiate()
{

	gameObject.SetActive( false );
	
	isActive = false;

	slgd = SublayerGameDelegate.instance;
	
	targetLine.onInstantiate();
	
}



function initPresetDrone()
{

	var _droneHashtable : System.Collections.Hashtable = getDroneWithModelNumber( modelString );

	modelString = _droneHashtable["modelNumber"];

	dronePowerState = DRONE_POWER_NONE;

	adjustStatsForPowerDiversion();

	health = maxHealth;

	nullifiable = _droneHashtable["hackable"];

	waveTypes = _droneHashtable["waveTypes"];

	state = DRONE_STATE_PRESET_IDLE;

	circleRenderer.gameObject.SetActive( false );

	hackedScopeList[0] = false;
	hackedScopeList[1] = false;
	hackedScopeList[2] = false;

	// Set position
	position = gameObject.transform.localPosition;

	// Set target
	attackTarget = slgd.stratolithIcon;
	destination = slgd.stratolithIcon.transform.localPosition;
	
	// Set proper direction
	var dif : Vector2 = position - destination;
	var angleFromDroneToTargetInRads : float = Mathf.Atan2( dif.x, dif.y );
	var angleFromDroneToTargetInDegrees : float = angleFromDroneToTargetInRads * Mathf.Rad2Deg;
	angleFromDroneToTargetInDegrees -= 180.0;
	angleFromDroneToTargetInDegrees = Mathf.Abs( angleFromDroneToTargetInDegrees );
	
	icon.gameObject.transform.localEulerAngles.z = angleFromDroneToTargetInDegrees;
	direction = icon.gameObject.transform.localEulerAngles.z;
	
	baseInitialize();

}



function initRandomDrone( _totalPower : int )
{

	// Initial setup
	var remainingPower : int = _totalPower;
	var statsArray = [0, 0, 0, 0];
	var statsIndex : int = 0;
	var hasWeapons : int = Random.Range(0, 2);
	var iteration : int = 0;

	// Setup based on weapons
	if( hasWeapons == 0 )
	{
		statsArray = [0, 1, 0, 1];
		remainingPower -= 2;
	}
	else if( hasWeapons == 1 )
	{
		statsArray = [1, 1, 1, 1];
		remainingPower -= 4;
	}

	// Populate stats inside while loop
	while( remainingPower > 0 )
	{

		statsIndex += 1;

		if( statsIndex >= 4 )
		{
			statsIndex = 0;
		}

		// Skip damage and range attributes if no weapons available
		if( hasWeapons == 0 && statsIndex == 0 )
			continue;
		if( hasWeapons == 0 && statsIndex == 2 )
			continue;

		// Skip if this attribute is already maxed out
		if( statsArray[statsIndex] >= 9 )
			continue;

		var randIncrease : int = Random.Range(0, 2);
		statsArray[statsIndex] += randIncrease;
		remainingPower -= randIncrease;

		// Skip if all attributes maxed out
		if(
			hasWeapons == 0 &&
			statsArray[1] >= 9 &&
			statsArray[3] >= 9
		)
		{
			remainingPower = 0;
		}
		
		if(
			hasWeapons == 1 &&
			statsArray[0] >= 9 &&
			statsArray[1] >= 9 &&
			statsArray[2] >= 9 &&
			statsArray[3] >= 9
		)
		{
			remainingPower = 0;
		}

	}
	
	modelString = statsArray[0].ToString("D0") + statsArray[1].ToString("D0") + statsArray[2].ToString("D0") + statsArray[3].ToString("D0");

	dronePowerState = DRONE_POWER_NONE;

	adjustStatsForPowerDiversion();

	health = maxHealth;

	nullifiable = true;

	// waveTypes = 3;

	state = DRONE_STATE_ATTACK_STRATOLITH;
	circleRenderer.gameObject.SetActive( true );

	hackedScopeList[0] = false;
	hackedScopeList[1] = false;
	hackedScopeList[2] = false;

	attackTarget = slgd.stratolithIcon;
	
	
	// Set position
	position = gameObject.transform.localPosition;

	// Set target
	attackTarget = slgd.stratolithIcon;
	destination = slgd.stratolithIcon.transform.localPosition;
	
	
	// Set proper direction
	var dif : Vector2 = position - destination;
	var angleFromDroneToTargetInRads : float = Mathf.Atan2( dif.x, dif.y );
	var angleFromDroneToTargetInDegrees : float = angleFromDroneToTargetInRads * Mathf.Rad2Deg;
	angleFromDroneToTargetInDegrees -= 180.0;
	angleFromDroneToTargetInDegrees = Mathf.Abs( angleFromDroneToTargetInDegrees );
	
	icon.gameObject.transform.localEulerAngles.z = angleFromDroneToTargetInDegrees;
	direction = icon.gameObject.transform.localEulerAngles.z;
	
	baseInitialize();

}



function initDroneFromHashtable( _droneHashtable : System.Collections.Hashtable )
{

	modelString = _droneHashtable["modelNumber"];

	dronePowerState = DRONE_POWER_NONE;

	adjustStatsForPowerDiversion();

	health = maxHealth;

	nullifiable = _droneHashtable["hackable"];

	waveTypes = _droneHashtable["waveTypes"];

	state = DRONE_STATE_ATTACK_STRATOLITH;
	circleRenderer.gameObject.SetActive( true );

	hackedScopeList[0] = false;
	hackedScopeList[1] = false;
	hackedScopeList[2] = false;

	attackTarget = slgd.stratolithIcon;
	
	
	// Set position
	position = gameObject.transform.localPosition;

	// Set target
	attackTarget = slgd.stratolithIcon;
	destination = slgd.stratolithIcon.transform.localPosition;
	
	
	// Set proper direction
	var dif : Vector2 = position - destination;
	var angleFromDroneToTargetInRads : float = Mathf.Atan2( dif.x, dif.y );
	var angleFromDroneToTargetInDegrees : float = angleFromDroneToTargetInRads * Mathf.Rad2Deg;
	angleFromDroneToTargetInDegrees -= 180.0;
	angleFromDroneToTargetInDegrees = Mathf.Abs( angleFromDroneToTargetInDegrees );
	
	icon.gameObject.transform.localEulerAngles.z = angleFromDroneToTargetInDegrees;
	direction = icon.gameObject.transform.localEulerAngles.z;
	
	baseInitialize();

}



function baseInitialize()
{

	updateLabelText();
	
	counter = 0;
	
	reloadCounter = 0;
	
	jitterCounter = 0;

	isActive = true;

	
	//reset graphics
	gameObject.SetActive( true );
	droneInfoLabel.gameObject.SetActive( true );
	itemGraphic.gameObject.SetActive( false );
	
	gameObject.transform.localScale.x = 1.0;
	gameObject.transform.localScale.y = 1.0;
	
	updateDroneGraphics();
	
	setDroneColor();

	circleRenderer.onInitialize( attackRange, hackedScopeList[0] );

}



function initializeDockedDrone( _modelString : String )
{
	
	modelString = _modelString;

	dronePowerState = DRONE_POWER_NONE;

	adjustStatsForPowerDiversion();

	health = maxHealth;

	state = DRONE_STATE_IDLE;
	
	hackedScopeList[0] = true;
	hackedScopeList[1] = true;
	hackedScopeList[2] = true;

	attackTarget = null;

	
	//set position
	position = slgd.stratolithWorldPosition;
	
	
	baseInitialize();

}



function updateDrone()
{

	// Preset drones wait to come into radar view
	if( state == DRONE_STATE_PRESET_IDLE )
	{
		if( insideRadar() == true )
		{
			state = DRONE_STATE_ATTACK_STRATOLITH;
			circleRenderer.gameObject.SetActive( true );
		}
		else
		{
			return;
		}
	}


	handleSurge();

	handleNavigation();
	
	updatePosition();
	
	handleTactical();
	
	droneCollision();

}



function handleSurge()
{

	// Skip if drone is ready to surge
	if( surgeState == SURGE_STATE_READY )
		return;


	// Surge is ON
	if( surgeState == SURGE_STATE_ON )
	{
		surgeAmount -= surgeUseRate;

		// Surge finished
		if( surgeAmount <= 0.0 )
		{
			surgeFinished();
		}

	}
	else if( surgeState == SURGE_STATE_RECHARGING )
	{
		surgeAmount += surgeRechargeRate;

		// Recharge finished
		if( surgeAmount >= 1.0 )
		{
			surgeRechargeFinished();
		}
	}


	// Cap
	if( surgeAmount < 0.0 )
		surgeAmount = 0.0;
	if( surgeAmount > 1.0 )
		surgeAmount = 1.0;


	if( slgd.activeDrone == this )
	{
		scopeList[2].setSurgePowerBarsForDrone();
	}

}


function surgeRechargeFinished()
{

	// Set to ready state
	surgeState = SURGE_STATE_READY;


	// Update labels
	if( slgd.activeDrone == this )
		scopeList[2].setForHackedState();
}



function surgeFinished()
{

	// Set to recharging state
	surgeState = SURGE_STATE_RECHARGING;

	adjustStatsForPowerDiversion();


	// Update labels
	if( slgd.activeDrone == this )
	{
		slgd.setActiveDronePerformanceGauges();
		scopeList[2].setForHackedState();
	}
		

}



function handleNavigation()
{


	if( state == DRONE_STATE_ATTACK_STRATOLITH )
	{		
		
		// Update destination to target position
		destination = attackTarget.transform.localPosition;

		// Don't move if close enough to attack
		var positionDif : Vector2 = destination - position;
		var distanceFromTarget : float = positionDif.magnitude;
		var stopThreshold : float = attackRange - 10.0;

		if( distanceFromTarget > stopThreshold )
		{
			turnTowardTargetPosition();
		}
		
	}
	
	
	if( state == DRONE_STATE_MOVE )
	{
	
		//stop if close enough to target
		stopThreshold = 10.0;
		
		distanceFromTarget = turnTowardTargetPosition();
		
		if( distanceFromTarget < stopThreshold )
		{
			startIdle();
		}
	
	}
	
	
	if( state == DRONE_STATE_ATTK )
	{
	
		// Update destination to target position
		destination = attackTarget.transform.localPosition;

		// Don't move if close enough to attack
		positionDif = attackTarget.transform.localPosition - position;
		distanceFromTarget = positionDif.magnitude;
		stopThreshold = attackRange - 5.0;
		
		if( distanceFromTarget > stopThreshold )
		{
			turnTowardTargetPosition();
		}
	
	}
	
	
	if( state == DRONE_STATE_DOCK )
	{
	
		//stop if close enough to target
		stopThreshold = 80.0;

		// Update destination to match stratolith actual position
		destination = slgd.stratolithIcon.transform.localPosition;
		
		distanceFromTarget = turnTowardTargetPosition();
		
		if( distanceFromTarget < stopThreshold )
		{
		
			startIdle();
			
			attemptEnteringStratolith();
			
		}
	
	}


	if( state == DRONE_STATE_SLVG )
	{
	
		//stop if close enough to target
		stopThreshold = 10.0;
		
		distanceFromTarget = turnTowardTargetPosition();
		
		if( distanceFromTarget < stopThreshold )
		{

			startIdle();
			slgd.onDroneCollectItem( this );
			
		}
	
	}
	
	
	
	if( state == DRONE_STATE_IDLE )
	{
	
		//do nothing
		
	}
	
	
	if( state == DRONE_STATE_DYING )
	{
	
		gameObject.transform.localScale.x *= 1.2;
		gameObject.transform.localScale.y *= 0.75;
		
		
		if( gameObject.transform.localScale.y <= 0.05 )
		{
			
			deactivate();
			
		}
		
	}

}



function insideRadar() : boolean
{

	var dif : Vector2 = position - slgd.instance.stratolithWorldPosition;
	
	var distance : float = dif.magnitude;
	
	if( distance > SublayerGameDelegate.instance.scannerWidth )
		return false;
	else
		return true;

}



function adjustForNewTargetPoint()
{

	var dif : Vector2 = position - destination;
	
	var distance : float = dif.magnitude;
	
	speed = maxSpeed;

}



function turnTowardTargetPosition() : float
{	
	
	//find difference in position
	var pointDif : Vector2 = destination - position;
	var angleInRads : float = Mathf.Atan2( pointDif.y, pointDif.x );
	var angleInDegrees : float = angleInRads * Mathf.Rad2Deg;
	
	
	//change angle to 0 - 360 number
	angleInDegrees -= 90.0;
	
	if( angleInDegrees < 0.0 )
		angleInDegrees += 360.0;
		
		
	//make drone turn toward the smaller angle
	var angleDif : float =  angleInDegrees - direction;

	if( angleDif < -180 )
	{
		angleDif += 360.0;
	}
	else if( angleDif > 180 )
	{
		angleDif -= 360.0;
	}
	
	
	//slow down as drone approaches correct facing
	var turningAbility : float = speed * 0.025;
	
	var angleOfTurn : float = angleDif * turningAbility;
	
	direction += angleOfTurn;
	
	
	//wrap direction to be 0 to 360
	if( direction > 360.0 )
		direction -= 360.0;
	else if( direction < 0.0 )
		direction += 360.0;
	
		
	//return the distance to target
	var distanceFromTarget : float = pointDif.magnitude;
	
	return distanceFromTarget;

}



function droneCollision()
{

	//skip if this drone drone is docked or dying
	if(
		state == DRONE_STATE_PREPARING_TO_DOCK ||
		state == DRONE_STATE_DOCKED ||
		state == DRONE_STATE_PREPARING_TO_LAUNCH ||
		state == DRONE_STATE_CHARGED_TO_DEATH ||
		state == DRONE_STATE_DYING
	)
		return;


	// Hostile drone vs. Stratolith collision
	if( hackedScopeList[0] == false )
	{
		var vectorToStratolith : Vector2 = slgd.stratolithWorldPosition - position;
		var distanceToStratolith : float = vectorToStratolith.magnitude;

		if( distanceToStratolith < 70.0 )
		{

			slgd.stratolithTakesDamage( 1.0 );
			damageDrone( 1.0 );

		}

	}


	// Drone vs. drone collision
	for( var d : int = 0; d < slgd.numDrones; d++ )
	{

		if( !slgd.droneList[d] )
			continue;
		
		var drone : Drone = slgd.droneList[d];
	
		//skip inactive drones
		if( drone.isActive == false )
			continue;
		
		
		//skip self
		if( drone == this )
			continue;
			
			
		//skip other docked and dying drones
		if(
			drone.state == DRONE_STATE_PREPARING_TO_DOCK ||
			drone.state == DRONE_STATE_DOCKED ||
			drone.state == DRONE_STATE_PREPARING_TO_LAUNCH ||
			drone.state == DRONE_STATE_CHARGED_TO_DEATH ||
			drone.state == DRONE_STATE_DYING
		)
			continue;
			
		
		//get distance
		var dif : Vector2 = position - drone.position;
		
		var distance : float = dif.magnitude;
		
		var collisionRange : float = 30.0;
		
		if( distance < collisionRange )
		{
			// Damage both drones
			damageDrone( 1.0 );
			drone.damageDrone( 1.0 );
		}
		
	}
}



function findHostileDroneWithinAttackRange() : Drone
{

	for( var d : int = 0; d < slgd.numDrones; d++ )
	{
		
		var drone : Drone = slgd.droneList[d];
	
		//skip inactive drones
		if( drone.isActive == false )
			continue;
		
		
		//skip self
		if( drone == this )
			continue;
			
			
		//skip if not hostile
		if( drone.hackedScopeList[0] == true )
			continue;
			
		
		//get distance
		var dif : Vector2 = position - drone.position;
		
		var distance : float = dif.magnitude;
		
		if( distance < attackRange )
		{
			return drone;
		}
		
	}

}



function findHackedDroneWithinAttackRange() : Drone
{

	for( var d : int = 0; d < slgd.numDrones; d++ )
	{
		// Skip null drones
		if( !slgd.droneList[d] )
			continue;
		
		var drone : Drone = slgd.droneList[d];
	
		//skip inactive drones
		if( drone.isActive == false )
			continue;
		
		
		//skip self
		if( drone == this )
			continue;
			
			
		//skip if not hacked
		if( drone.hackedScopeList[0] == false )
			continue;
		
		//get distance
		var dif : Vector2 = position - drone.position;
		
		var distance : float = dif.magnitude;
		
		if( distance < attackRange )
		{
			return drone;
		}
		
	}

	return null;

}



function startMove( _destinationCoordinates : Vector2 )
{
	
	state = DRONE_STATE_MOVE;

	destination = _destinationCoordinates;
	
	attackTarget = null;

}



function startSlvg( _itemLocator : ItemLocator )
{

	state = DRONE_STATE_SLVG;

	targetItem = _itemLocator;

	destination = _itemLocator.gameObject.transform.localPosition;
	
	attackTarget = null;

}



function startDock( )
{
	
	destination = slgd.stratolithIcon.transform.localPosition;
	
	attackTarget = null;
	
	state = DRONE_STATE_DOCK;
	
}



function startAttk( _drone : Drone )
{
	
	state = DRONE_STATE_ATTK;
	
	attackTarget = _drone.gameObject;
	
	destination = _drone.position;
	
}



function startIdle()
{
	
	state = DRONE_STATE_IDLE;
	
	attackTarget = null;
	
	destination = position;
	
}



function startDroneDeath()
{
	
	state = DRONE_STATE_DYING;
	
	droneInfoLabel.gameObject.SetActive( false );
	
	targetIcon.gameObject.SetActive( false );

	circleRenderer.gameObject.SetActive( false );
	
	targetLine.setDotState( false );

	var droneDeathMessage : String = modelString + " DRONE DESTROYED";
	SublayerGameDelegate.instance.addMessage( droneDeathMessage );
	
	//GameManager.instance.SFX_HOSTILE_DESTROYED.Play();

	// Leave item
	var itemsOnRadarCount : int = slgd.getItemsOnRadarCount();
	var dropPercentage : float = 100.0 - ( itemsOnRadarCount * 10.0 );

	var randDropItem : float = Random.Range(0.0, 100.0);
	if( randDropItem <= dropPercentage )
	{
		SublayerGameDelegate.instance.placeItemAtPosition( gameObject.transform.position );
	}
	
}




function attemptEnteringStratolith()
{

	slgd.attemptDroneDock( this );

}



function enteredStratolith()
{

	//deselect this drone if currently selected
	if( slgd.activeDrone == this )
		slgd.deselectRadarObject();

	droneDockingCounter = 360;
	
	state = DRONE_STATE_PREPARING_TO_DOCK;
	
	speed = 0.0;
	
	gameObject.SetActive( false );

}



function updatePosition()
{		

	//get thrust vector
	var angleInRads = direction * Mathf.Deg2Rad;
	
	var xcomp : float = -Mathf.Sin( angleInRads );
	var ycomp : float = Mathf.Cos( angleInRads );
	
	var velocity : Vector2 = Vector2( xcomp, ycomp );
	velocity.Normalize();
	

	//hacked drones gradually increase and decrease speed
	var pointDif : Vector2 = destination - position;
	
	var distance : float = pointDif.magnitude;
	
	
	// Set distance threshold for accel/decel
	// (when drone is closer than this threshold, it will stop)
	var accelThreshold : float = 0.0;
	
	if( state == DRONE_STATE_ATTACK_STRATOLITH )
	{
		accelThreshold = attackRange;
	}
	if( state == DRONE_STATE_IDLE )
	{
		accelThreshold = 9999.0;
	}
	if( state == DRONE_STATE_MOVE )
	{
		accelThreshold = 30.0;
	}
	else if( state == DRONE_STATE_ATTK )
	{
		accelThreshold = attackRange + 5.0;
	}
	else if( state == DRONE_STATE_DOCK )
	{
		accelThreshold = 80.0;
	}
	else if( state == DRONE_STATE_SLVG )
	{
		accelThreshold = 30.0;
	}
	else if( state == DRONE_STATE_PREPARING_TO_DOCK ||
			 state == DRONE_STATE_DOCKED ||
			 state == DRONE_STATE_PREPARING_TO_LAUNCH ||
			 state == DRONE_STATE_CHARGED_TO_DEATH)
	{
		accelThreshold = 9999.0;
	}
	
	
	//make drone slow down or speed up depending on distance from target
	if( distance < accelThreshold )
	{
		speed *= decelRate;
	}
	else
	{
	
		//boost drone speed back to normal if stopped
		if( speed <= startSpeed )
			speed = startSpeed;
	
		//accel
		speed *= accelRate;
	}
	
	
	//clamp speed
	if( speed >= maxSpeed )
	{
		speed = maxSpeed;
	}
	
	
	velocity *= speed;
	

	//add velocity to position
	position += velocity;

}



function updateDroneGraphics()
{	
	
	//jitter
	var jitterOffset : Vector2 = Vector2( 0.0, 0.0 );
	
	if( jitterCounter > 0 )
	{
	
		jitterCounter--;
		
		jitterOffset.x = Random.Range( -1, 2 );
		jitterOffset.y = Random.Range( -1, 2 );
		
	}
	
	
	//update position
	
	
	//round for radar
	var roundedPosX : float = Mathf.RoundToInt( position.x + jitterOffset.x );
	var roundedPosY : float = Mathf.RoundToInt( position.y + jitterOffset.y );
	var roundedPos : Vector3 = Vector3( roundedPosX, roundedPosY, -50.0 );
	
	gameObject.transform.localPosition = roundedPos;
	
	
	//update rotation
	icon.gameObject.transform.eulerAngles.z = direction;
	direction = icon.gameObject.transform.eulerAngles.z;
	
	
	//update position of children graphics
	droneInfoLabel.gameObject.transform.position.x = icon.transform.position.x + 40.0;
	droneInfoLabel.gameObject.transform.position.y = icon.transform.position.y;
	
	
	// Destination icon
	if( state == DRONE_STATE_MOVE || state == DRONE_STATE_SLVG )
	{
		setDestinationIcon();
	}
	else
	{
		if( destinationIcon.gameObject.activeSelf == true )
		{
			destinationIcon.gameObject.SetActive( false );
			targetLine.setDotState( false );
		}
	}
	
	
	
	// Target icon
	if( state == DRONE_STATE_ATTK )
	{
		setTargetIcon();
	}
	else
	{
		if( targetIcon.gameObject.activeSelf == true )
		{
			targetIcon.gameObject.SetActive( false );
			targetLine.setDotState( false );
		}	
	}
	
	
	// Set selection lines if selected
	if( slgd.activeDrone == this )
	{
		slgd.updateSelectionLines( gameObject.transform.position );
	}


	// Is drone inside a cloud?
	checkForCloudCollision();
	
}



function checkForCloudCollision()
{

	insideCloud = false;
	var ray : Ray = new Ray( gameObject.transform.position, Vector3(0.0, 0.0, -1.0) );
	var hitList : RaycastHit[] = Physics.RaycastAll( ray, 1000 );

	// Bail if nothing hit
	if( hitList.length <= 0 )
	{
		return;
	}

	for( var i : int = 0; i < hitList.length; i++ )
	{
		var hit : RaycastHit = hitList[i];
		
		var cloud : Cloud = hit.collider.GetComponent( Cloud );

		if( cloud == null )
			continue;

		// if( slgd.activeDrone == this )
		// 	slgd.deselectRadarObject();

		// gameObject.SetActive( false );
		insideCloud = true;

	}

}



function setDestinationIcon()
{
	
	destinationIcon.gameObject.SetActive( true );
	
	var destinationScreenCoordinates : Vector2 = slgd.worldMapToScreenCoordinates( destination );
	destinationIcon.gameObject.transform.position = destinationScreenCoordinates;
	destinationIcon.gameObject.transform.position.z = -50.0;
	
	// Line
	var iconOffset : float = 40.0;
	var dif : Vector2 = gameObject.transform.position - destinationScreenCoordinates;
	
	
	// Bail if too close (don't draw inverse line)
	if( dif.magnitude < iconOffset * 2.0 )
	{
		targetLine.setDotState( false );
		return;
	}
	
	dif = dif.normalized * iconOffset;
	
	var startPos : Vector2 = gameObject.transform.position - dif;
	var endPos : Vector2 = destinationScreenCoordinates + ( dif * 0.5 );
	
	targetLine.drawLineBetweenPoints( startPos, endPos );
	
}



function setTargetIcon()
{
	
	targetIcon.gameObject.SetActive( true );
	
	targetIcon.gameObject.transform.position = attackTarget.transform.position;
	
	targetIcon.gameObject.transform.position.z = -50.0;
	
	
	//line
	var iconOffset : float = 40.0;
	var dif : Vector2 = gameObject.transform.position - attackTarget.transform.position;
	
	
	//bail if too close (don't draw inverse line)
	if( dif.magnitude < iconOffset * 2.0 )
	{
		targetLine.setDotState( false );
		return;
	}
	
	dif = dif.normalized * iconOffset;
	
	var startPos : Vector2 = gameObject.transform.position - dif;
	var endPos : Vector2 = attackTarget.transform.position + dif;
	
	targetLine.drawLineBetweenPoints( startPos, endPos );

}



function handleTactical()
{

	reloadCounter--;
	
	
	// Go idle if attack target dies
	if( state == DRONE_STATE_ATTK )
	{
		var targetDrone : Drone = attackTarget.gameObject.GetComponent( Drone );
		
		if( targetDrone.isActive == false || targetDrone.state == DRONE_STATE_DYING )
		{
			startIdle();
		}
		
	}
	
	
	// Bail if not yet reloaded
	if( reloadCounter > 0 )
		return;


	// Special case for hostile drones
	// If not within range of Stratolith, attack closer nulled drone first
	// If no null drones nearby, proceed to Stratolith
	if( hackedScopeList[0] == false )
	{

		var stratolithPositionDif : Vector2 = slgd.stratolithWorldPosition - position;
		var distanceToStratolith : float = stratolithPositionDif.magnitude;

		if( distanceToStratolith < attackRange )
		{
			attackTarget = slgd.stratolithIcon;
		}
		else
		{
			var enemyDrone : Drone = findHackedDroneWithinAttackRange();
		
			if( enemyDrone )
				attackTarget = enemyDrone.gameObject;
			else
				attackTarget = slgd.stratolithIcon;
		}

	}
	
	
	// Bail if no attack target
	if( attackTarget == null )
		return;
		
	
	// Measure distance to target
	var positionDif : Vector2 = attackTarget.transform.localPosition - position;
	var distance : float = positionDif.magnitude;
	
	if( distance < attackRange )
	{
		
		fireOnTarget( attackTarget );
		reloadCounter = reloadCounterMax;
	
	}

}



function fireOnTarget( _target : GameObject )
{

	var bullet : Bullet = slgd.getFreeBullet();
			
	bullet.onInit( this, _target );
	
	GameManager.instance.SFX_BULLET_FIRED.Play();

}



function hostileSelfDestruct()
{

	// if( attackTarget == slgd.shieldScannerCenter.gameObject )
	// {
	
	// 	slgd.stratolithHitByBullet( droneType );
		
	// }
	// else
	// {
	
	// 	var drone : Drone = attackTarget.GetComponent( Drone );
			
	// 	if( drone != null )
	// 	{
		
	// 		drone.hitByBullet( droneType );
			
	// 	}
		
	// }
	
	// damageDrone( 100.0 );
	
}



function deactivate()
{

	//deselect this drone if currently selected
	if( slgd.activeDrone == this )
		slgd.deselectRadarObject();

	isActive = false;
	
	gameObject.SetActive( false );
	
	targetLine.setDotState( false );

}



function updateLabelText()
{

	droneInfoLabel.text = modelString + "\n" + health.ToString("F0") + "P";
	droneInfoLabel.Commit();

}



function hitByBullet( _bullet : Bullet )
{

	var damage : float = _bullet.damage;
	
	damageDrone( damage );
	
	GameManager.instance.SFX_HOSTILE_DESTROYED.Play();

}



function damageDrone( _damage : float )
{

	// Reduce damage taken based on shield power diversion.
	// shieldIndex of 0 takes full damage, shieldIndex of 9 takes 1/10th damage
	var damageReductionFactor : float = 1.0 - (shieldIndex * 0.1);
	_damage *= damageReductionFactor;

	health -= _damage;
	
	updateLabelText();
	
	if( health <= 0.0 )
	{
		startDroneDeath();
		return;
	}
	
	
	jitterCounter += 10;
	
}



//////////////////////////////////////////////////////
// Power Diversion and Stats
//////////////////////////////////////////////////////



function adjustStatsForPowerDiversion()
{

	damageIndex = parseInt( "" + modelString[0] );
	velocityIndex = parseInt( "" + modelString[1] );
	rangeIndex = parseInt( "" + modelString[2] );
	shieldIndex = parseInt( "" + modelString[3] );

	
	// Diverted stats
	var powerModifier : int = 1;
	if( dronePowerState == DRONE_POWER_WEAP )
	{
		damageIndex += powerModifier;
		velocityIndex -= powerModifier;
		rangeIndex -= powerModifier;
		shieldIndex -= powerModifier;
	}
	else if( dronePowerState == DRONE_POWER_VELO )
	{
		damageIndex -= powerModifier;
		velocityIndex += powerModifier;
		rangeIndex -= powerModifier;
		shieldIndex -= powerModifier;
	}
	else if( dronePowerState == DRONE_POWER_RNGE )
	{
		damageIndex -= powerModifier;
		velocityIndex -= powerModifier;
		rangeIndex += powerModifier;
		shieldIndex -= powerModifier;
	}
	else if( dronePowerState == DRONE_POWER_SHLD )
	{
		damageIndex -= powerModifier;
		velocityIndex -= powerModifier;
		rangeIndex -= powerModifier;
		shieldIndex += powerModifier;
	}


	// Surge stats
	var surgeModifier : int = 1;
	if( surgeState == SURGE_STATE_ON )
	{
		if( dronePowerState == DRONE_POWER_WEAP )
		{
			damageIndex += surgeModifier;
		}
		else if( dronePowerState == DRONE_POWER_VELO )
		{
			velocityIndex += surgeModifier;
		}
		else if( dronePowerState == DRONE_POWER_RNGE )
		{
			rangeIndex += surgeModifier;
		}
		else if( dronePowerState == DRONE_POWER_SHLD )
		{
			shieldIndex += surgeModifier;
		}
	}


	// Clamp
	if( damageIndex < 0 )
		damageIndex = 0;
	if( velocityIndex < 0 )
		velocityIndex = 0;
	if( rangeIndex < 0 )
		rangeIndex = 0;
	if( shieldIndex < 0 )
		shieldIndex = 0;

	if( damageIndex > 10 )
		damageIndex = 10;
	if( velocityIndex > 10 )
		velocityIndex = 10;
	if( rangeIndex > 10 )
		rangeIndex = 10;
	if( shieldIndex > 10 )
		shieldIndex = 10;


	bulletDamage = damageIndex;
	reloadCounterMax = 200;
	maxSpeed = 0.0375 + ((0.15 - 0.0375) * (velocityIndex / 10.0));
	attackRange = (900.0 * (rangeIndex / 10.0));  // From 0 to 900
	// maxHealth = shieldIndex * 2;
	maxHealth = damageIndex + velocityIndex + rangeIndex + shieldIndex;

	circleRenderer.onInitialize( attackRange, hackedScopeList[0] );

}






//////////////////////////////////////////////////////
// Drone Graphics
//////////////////////////////////////////////////////


function setDroneColor()
{
	
	//Debug.Log( "setDroneColor()" );
	
	var color : Color = Color.red;
	

	if( hackedScopeList[0] == true ) //white for null units
	{
	
		color.r = 255.0 / 255.0;
		color.g = 255.0 / 255.0;
		color.b = 255.0 / 255.0;
		color.a = 0.6;
		
	}
	else //default to yellow (hostile)
	{
	
		color.r = 255.0 / 255.0;
		color.g = 239.0 / 255.0;
		color.b = 64.0 / 255.0;
		color.a = 0.8;
	}


	//set icon sprite
	if( hackedScopeList[0] == true )
	{
		icon.SetSprite( "Radar-NullUnit" );
	}
	else
	{
		icon.SetSprite( "Radar-Hostile" );
	}
	
	
	//set label color
	droneInfoLabel.color = color;
	droneInfoLabel.Commit();


	//circle renderer
	circleRenderer.onInitialize( attackRange, hackedScopeList[0] );

	// If selected on radar
	if( this == slgd.activeDrone )
	{
		slgd.setSelectionLines( hackedScopeList[0] );
	}
	
}






