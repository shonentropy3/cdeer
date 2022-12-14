package blockchain

import (
	"github.com/lib/pq"
	"strconv"
)

var currencyNames = map[uint8]string{1: "USD", 2: "ETH", 3: "BNB"}

func ParseSkills(skills int64) (res pq.Int64Array) {
	skillsBin := strconv.FormatInt(skills, 2)
	var skillsList pq.Int64Array
	for i := 0; i <= len(skillsBin)/8; i++ {
		if i == len(skillsBin)/8 {
			skillInt, _ := strconv.ParseInt(skillsBin[:len(skillsBin)-8*i], 2, 64)
			skillsList = append(skillsList, skillInt+100)
		} else {
			skillInt, _ := strconv.ParseInt(skillsBin[len(skillsBin)-8*(i+1):len(skillsBin)-8*i], 2, 64)
			skillsList = append(skillsList, skillInt+100)
		}
	}
	return skillsList
}
