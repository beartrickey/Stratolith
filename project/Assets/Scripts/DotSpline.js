#pragma strict
@script ExecuteInEditMode()

var pathPoints = new Transform[4];
var tension : float = 0.0;

//dots
var endPadding : float = 0.1;
var startingT : float = 0.0;
var dotOffset : float = 0.0;
var velocity : float = 0.001;
var dotSpacing : float;
var numDots : int = 10;
var splineDotList = new GameObject[numDots];
var stageA : Stage;
var stageB : Stage;
var totalLength : float = 0.0;


function Update()
{

    if( Application.isPlaying )
        return;

    initSpline(stageA);

}


function initDots()
{

    var dotPrefab : GameObject = Resources.Load("MapScreenDot");

    
    setTotalLength();
    numDots = Mathf.Ceil( totalLength * 0.016 );

    //make dots and position along spline
    for( var i : int = 0; i < numDots; i++ )
    {

        Instantiate( dotPrefab, Vector3.zero, dotPrefab.transform.rotation );

        var dot = GameObject.Instantiate( dotPrefab, Vector3.zero, dotPrefab.transform.rotation );

        dot.transform.localScale.x = 0.75;

        splineDotList[i] = dot;

        // var sprite : tk2dSprite = dot.GetComponent( tk2dSprite );

    }

}


function initSpline( startStage : Stage )
{

    if( splineDotList[0] == null )
    {
        initDots();
    }

    var totalT : float = 1.0 - (endPadding * 2.0);

    dotSpacing = totalT / numDots;

    // Determine direction to move dots in (moves from A to B with positive velocity)
    if( startStage == stageA )
    {
        velocity = Mathf.Abs( velocity );
        startingT = endPadding;
    }
    else
    {
        velocity = -1 * Mathf.Abs( velocity );
        startingT = endPadding + dotSpacing;
    }

    updateSpline();

}



function updateSpline()
{

    // Every frame offset dots just a little until they've travelled one dot length. Then reset the offset back to 0.0
    dotOffset += velocity;

    if( Mathf.Abs(dotOffset) > dotSpacing )
        dotOffset = 0.0;

    for( var i : int = 0; i < numDots; i++ )
    {

        var t : float = startingT + dotOffset + (i * dotSpacing);

        var position : Vector3 = getLocationAlongSpline(t);

        var rotation : float = getTangentAtPoint(t, position);

        splineDotList[i].transform.position = position;

        splineDotList[i].transform.localEulerAngles.z = rotation;

    }

}



function cleanSpline()
{

    for( var i : int = 0; i < numDots; i++ )
    {

        GameObject.Destroy( splineDotList[i] );
        splineDotList[i] = null;

    }

}



function setTotalLength()
{

    var p0 : Vector3 = pathPoints[0].position;
    var p1 : Vector3 = pathPoints[1].position;
    var p2 : Vector3 = pathPoints[2].position;
    var p3 : Vector3 = pathPoints[3].position;

    totalLength = Vector3.Distance(p0, p1) + Vector3.Distance(p1, p2) + Vector3.Distance(p2, p3);

}


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

    return (p0*b1 + p1*b2 + p2*b3 + p3*b4);

}



function getTangentAtPoint( t : float, currentPoint : Vector3 )
{

    // Next point
    var nextT : float = t + 0.001;

    var endT : float = 1.0 - endPadding;
    
    if(nextT > endT)
        nextT = t - 0.001;

    var nextPoint : Vector2 = getLocationAlongSpline(nextT);

    // point difference
    var dif : Vector2 = currentPoint - nextPoint;

    var angle : float = Mathf.Atan2( dif.x, dif.y ) * Mathf.Rad2Deg;
    angle -= 180.0;
    angle = Mathf.Abs( angle );

    angle += 90.0;

    return angle;

}


