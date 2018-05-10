#Health Stats 

![image](https://img.shields.io/badge/healthstats-is%20awesome-ff69b4.svg)

### Node module for calculating BMI, BMR and IBW:

##### How to:
1. npm install healthstats
2. include healthstats in your .js file
3. Use inches for 'height' and pounds for 'weight'
 
```javascript
var health = require('healthstats');
```
## Public Methods:

##### Body Masss Index - BMI
```javascript
health.female.BMI(weight, height);
health.male.BMI(weight, height);
```
##### Basal Metabolic Rate - BMR
>The amount of calories you need to
maintain body weight.
```javascript
health.female.BMR(weight, height, age);
health.male.BMR(weight, height, age);
```

###### BMR by lifestyle:

> In order to call the following methods, you must first set a BMR value, or else you must pass a BMR value manually.
``` javascript
//Sedentary 
health.female.noActivity(female.BMR);
health.male.noActivity(male.BMR);
//Light Activity 
health.female.lightActivity(female.BMR);
health.male.lightActivity(male.BMR);
//Moderate Activity 
health.female.moderateActivity(female.BMR);
health.male.moderateActivity(male.BMR);
//Very Active
health.female.veryActive(female.BMR);
health.male.verActive(male.BMR)
//Extremely Active
health.female.extremelyActive(female.BMR);
health.male.extremelyActive(male.BMR);
```

##### Ideal Body Weight - IBW
```javascript
health.female.IBW(height);
health.male.IBW(height);
```

###### Author: Alex Bennett
> Licesnse: MIT


