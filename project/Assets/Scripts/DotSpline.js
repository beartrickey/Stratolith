#pragma strict

var pathPoints = new Transform[4];
var tension : float = 0.0;


function getLocationAlongSpline( t : float )
{

    var p0 : Vector3 = pathPoints[0].position;
    var p1 : Vector3 = pathPoints[1].position;
    var p2 : Vector3 = pathPoints[2].position;
    var p3 : Vector3 = pathPoints[3].position;


    var tSquared : float  = t * t;
    var tCubed : float = tSquared * t;
    
	/*
	 * Formula: s(-ttt + 2tt - t)P1 + s(-ttt + tt)P2 + (2ttt - 3tt + 1)P2 + s(ttt - 2tt + t)P3 + (-2ttt + 3tt)P3 + s(ttt - tt)P4
	 */
    var s : float = ( 1 - tension ) * 0.5;
	
    var b1 : float = s * ((-tCubed + (2 * tSquared)) - t);                                  // s(-t3 + 2 t2 - t)P1
    var b2 : float = s * (-tCubed + tSquared) + (2 * tCubed - 3 * tSquared + 1);            // s(-t3 + t2)P2 + (2 t3 - 3 t2 + 1)P2
    var b3 : float = s * (tCubed - 2 * tSquared + t) + (-2 * tCubed + 3 * tSquared);        // s(t3 - 2 t2 + t)P3 + (-2 t3 + 3 t2)P3
    var b4 : float = s * (tCubed - tSquared);                                               // s(t3 - t2)P4
    
    // var x : float = (p0.x*b1 + p1.x*b2 + p2.x*b3 + p3.x*b4);
    // var y : float = (p0.y*b1 + p1.y*b2 + p2.y*b3 + p3.y*b4);
	
	// return Vector2( x, y );

    return (p0*b1 + p1*b2 + p2*b3 + p3*b4);

}



function getTangentAtPoint( t : float )
{

    var p0 : Vector3 = pathPoints[0].position;
    var p1 : Vector3 = pathPoints[1].position;
    var p2 : Vector3 = pathPoints[2].position;
    var p3 : Vector3 = pathPoints[3].position;

    var tan0 : float = Mathf.Atan2( p0.x - p1.x, p0.y - p1.y );
    tan0 *= Mathf.Rad2Deg;
    tan0 -= 180.0;
    tan0 = Mathf.Abs( tan0 );
    
    var tan1 : float = Mathf.Atan2( p2.x - p3.x, p2.y - p3.y );
    tan1 *= Mathf.Rad2Deg;
    tan1 -= 180.0;
    tan1 = Mathf.Abs( tan1 );

    var tanDif : float = tan1 - tan0;

    Debug.Log( "tan0: " + tan0 + ", tan1: " + tan1 + ", tanDif: " + tanDif );

    return tan0 + ( tanDif * t );

}


