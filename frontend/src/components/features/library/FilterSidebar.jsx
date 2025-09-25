import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

const challenges = ['Sensory Issues', 'Communication', 'Social Skills', 'Routine Management'];
const ages = ['Toddler (1-3)', 'Preschool (3-5)', 'School-Age (6-12)'];

const FilterSidebar = ({ filters, setFilters }) => {

    const handleChallengeChange = (challenge) => {
        setFilters(prev => {
            const newChallenges = prev.challenges.includes(challenge)
                ? prev.challenges.filter(c => c !== challenge)
                : [...prev.challenges, challenge];
            return { ...prev, challenges: newChallenges };
        });
    };

    return (
        <aside className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">Search</h3>
                <Input
                    placeholder="Search by keyword..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                />
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-3">Challenges</h3>
                <div className="space-y-2">
                    {challenges.map(challenge => (
                        <div key={challenge} className="flex items-center space-x-2">
                            <Checkbox
                                id={challenge}
                                checked={filters.challenges.includes(challenge)}
                                onCheckedChange={() => handleChallengeChange(challenge)}
                            />
                            <Label htmlFor={challenge} className="font-normal">{challenge}</Label>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-3">Age Group</h3>
                <div className="flex flex-wrap gap-2">
                    {ages.map(age => (
                        <Button
                            key={age}
                            variant={filters.age === age ? 'default' : 'outline'}
                            onClick={() => setFilters(prev => ({ ...prev, age: prev.age === age ? '' : age }))}
                        >
                            {age}
                        </Button>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;