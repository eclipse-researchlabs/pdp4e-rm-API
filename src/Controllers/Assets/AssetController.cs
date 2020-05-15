using Core.Assets.Implementation.Commands;
using Core.Assets.Implementation.Commands.Assets;
using Core.Assets.Implementation.Commands.Edges;
using Core.Assets.Interfaces.Services;
using Core.AuditTrail.Interfaces.Services;
using Core.AuditTrail.Models;
using Core.Database.Enums;
using Core.Database.Models;
using Core.Database.Tables;
using Core.Relationships.Implementation.Commands;
using Core.Relationships.Interfaces.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Api.Controllers.Assets
{
    [Route("api/assets"), ApiController, EnableCors("CorsRules")]
    public class AssetsController : ControllerBase
    {
        private IAssetService _assetService;
        private IRelationshipService _relationshipService;
        private IAuditTrailService _auditTrailService;

        public AssetsController(IAssetService assetService, IRelationshipService relationshipService, IAuditTrailService auditTrailService)
        {
            _assetService = assetService;
            _relationshipService = relationshipService;
            _auditTrailService = auditTrailService;
        }

        [HttpPost, ProducesResponseType(201)]
        public async Task<IActionResult> Create([FromBody] CreateAssetCommand command)
        {
            var newValue = await _assetService.Create(command);
            if (command.ContainerRootId.HasValue) _relationshipService.Create(new CreateRelationshipCommand()
            {
                FromType = ObjectType.Container,
                FromId = command.ContainerRootId.Value,
                ToType = ObjectType.Asset,
                ToId = newValue.Id,
                Payload = JsonConvert.SerializeObject(new AssetPayloadModel() { X = command.PayloadData.X, Y = command.PayloadData.Y })
            });
            _auditTrailService.LogAction(AuditTrailAction.CreateAsset, newValue.Id, new AuditTrailPayloadModel() { Data = JsonConvert.SerializeObject(command) });
            return Ok(newValue);    
        }

        [HttpPost("link"), ProducesResponseType(201)]
        public IActionResult LinkAssetToContainer([FromBody] LinkAssetToContainerCommand command)
        {
            _relationshipService.Create(new CreateRelationshipCommand()
            {
                FromType = ObjectType.Container,
                FromId = command.ContainerId,
                ToType = ObjectType.Asset,
                ToId = command.AssetId,
                Payload = JsonConvert.SerializeObject(new AssetPayloadModel() { X = command.X, Y = command.Y })
            });
            return Ok();
        }

        [HttpPut("position"), ProducesResponseType(200)]
        public async Task<IActionResult> MovePosition([FromBody] UpdateAssetPositionCommand command)
        {
            var newValue = await _assetService.MovePosition(command);
            _auditTrailService.LogAction(AuditTrailAction.MoveAsset, command.AssetId, new AuditTrailPayloadModel() { Data = JsonConvert.SerializeObject(command) });
            return Ok(newValue);
        }

        [HttpPut("name"), ProducesResponseType(200)]
        public IActionResult UpdateName([FromBody] ChangeAssetNameCommand command)
        {
            _assetService.ChangeName(command);
            //_auditTrailService.LogAction(AuditTrailAction.MoveAsset, command.AssetId, new AuditTrailPayloadModel() { Data = JsonConvert.SerializeObject(command) });
            return Ok();
        }

        [HttpPut("dfdQuestionaire"), ProducesResponseType(200)]
        public IActionResult UpdateDfdQuestionaire([FromBody] UpdateDfdQuestionaireCommand command)
        {
            _assetService.UpdateDfdQuestionaire(command);
            //_auditTrailService.LogAction(AuditTrailAction.MoveAsset, command.AssetId, new AuditTrailPayloadModel() { Data = JsonConvert.SerializeObject(command) });
            return Ok();
        }

        [HttpDelete("{ids}"), ProducesResponseType(201)]
        public IActionResult DeleteAsset(string ids)
        {
            foreach (var id in ids.Split(',').ToList().ConvertAll(Guid.Parse))
            {
                _assetService.Delete(id);
                //_auditTrailService.LogAction(AuditTrailAction.RemoveAssetGroup, id, new AuditTrailPayloadModel() { Data = JsonConvert.SerializeObject(id) });
            }
            return Ok();
        }
    }
}